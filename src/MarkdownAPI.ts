import { globbySync } from 'globby';
import matter from 'gray-matter';
import slugify from 'slugify';
import MiniSearch, { Options as MiniSearchOptions } from 'minisearch';
import { remark } from 'remark';
import strip from 'strip-markdown';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { parse } from 'yaml';
import deepmerge from 'deepmerge';

const toSlug = (string: string): string => slugify(string, { lower: true, strict: true });

export interface FileMetadata {
  description?: string;
  id: string,
  path: string,
  slug?: string;
  tags?: string[];
  title?: string;
}

export interface ParsedFile {
  content: string;
  metadata: FileMetadata;
  strippedContent: string;
}

export interface Options {
  config?: any;
  configPath?: string;
  directory: string;
  indexPath?: string;
  miniSearchOptions?: MiniSearchOptions<any>;
  useIndex?: boolean;
  writeIndex?: boolean;
}

export interface Config {
  fields?: Record<string, {
    required?: boolean;
  } | null>,
  tags?: Record<string, {
    description?: string;
  } | null>
}

const defaultConfig: Config = {
  tags: {},
  fields: {
    title: {
      required: false,
    },
    description: {
      required: false,
    },
    tags: {
      required: false,
    },
  },
};

export class MarkdownAPI {
  private static readonly stripper = remark()
    .use(strip);

  private filePaths!: string[];

  private miniSearch!: MiniSearch;

  private files!: Map<string, ParsedFile>;

  private readonly options: Options;

  private config!: Config;

  constructor(options: Options) {
    this.options = options;
    this.init();
  }

  public getOptions(): Options {
    return this.options;
  }

  public init() {
    this.config = this.loadConfig();
    this.filePaths = this.loadFilePaths();
    this.files = this.loadFiles();
    if (this.options.useIndex && existsSync(this.getIndexPath())) {
      this.miniSearch = this.loadIndexJSON();
    } else {
      this.miniSearch = this.buildIndex();
    }
    if (this.options.writeIndex) {
      this.writeIndexJSON();
    }
  }

  public parseFile(path: string): ParsedFile {
    const output = matter(readFileSync(path, 'utf8'));

    let {
      data: {
        // eslint-disable-next-line prefer-const
        id, title, slug, tags, description,
      },
    }: {
      data: Partial<FileMetadata>;
    } = output;

    if (!title || !title.trim().length) {
      title = path.split('/').pop()?.split('.').shift();
    }

    if (!slug || !slug.trim().length) {
      slug = toSlug(title as string);
    }

    if (!id) {
      const parts = path.split('/');
      id = `${parts.slice(1, parts.length - 1).join('-')}-${slug}`;
    }

    id = toSlug(id);

    if (!description) {
      description = '';
    }

    const defaultFieldKeys = Object.keys(defaultConfig.fields || {});

    const extraFieldKeys = Object.keys(this.config.fields || {})
      .map((x) => (this.config.fields?.[x] && !defaultFieldKeys.includes(x) ? x : null))
      .filter(Boolean) as string[];

    const extraFields = extraFieldKeys.reduce<Record<string, string>>((res, key) => ({
      ...res,
      [key]: (output.data as any)[key],
    }), {});

    const strippedContent = (MarkdownAPI.stripper.processSync(output.content)).toString();

    return {
      metadata: {
        id,
        title,
        slug,
        path,
        tags,
        description,
        ...extraFields,
      },
      content: output.content,
      strippedContent,
    };
  }

  public loadConfig() {
    let config = {};
    if (this.options.configPath) {
      config = parse(readFileSync(this.options.configPath, 'utf8'));
    } else if (this.options.config) {
      config = this.options.config;
    } else if (existsSync(`${this.options.directory}/config.yml`)) {
      config = parse(readFileSync(`${this.options.directory}/config.yml`, 'utf8'));
    } else if (existsSync(`${this.options.directory}/config.yaml`)) {
      config = parse(readFileSync(`${this.options.directory}/config.yaml`, 'utf8'));
    }

    return deepmerge(defaultConfig, config);
  }

  public getConfig(): Config {
    return this.config;
  }

  public getTags(): {
    description?: string;
    name: string;
  }[] {
    return Object.keys(this.config.tags || {}).map((x) => ({
      name: x,
      description: this.config.tags?.[x]?.description || '',
    }));
  }

  public loadFilePaths() {
    const paths = globbySync(this.options.directory, {
      expandDirectories: {
        files: ['*.md'],
      },
    });
    return paths;
  }

  public loadFiles(): Map<string, ParsedFile> {
    const parsedFiles = this.filePaths.map((x) => this.parseFile(x));

    const requiredFields = Object.keys(this.config.fields || {})
      .map((x) => (this.config.fields?.[x]?.required ? x : null))
      .filter(Boolean);

    let errors: string[] = [];

    const files = parsedFiles.reduce((map, file) => {
      errors = [
        ...errors,
        ...requiredFields.reduce<string[]>((res, requiredField) => {
          if (requiredField && !((file.metadata as any)[requiredField])) {
            return [...res, `Missing required field '${requiredField}' in ${file.metadata.path}`];
          }
          return res;
        }, []),
      ];

      map.set(file.metadata.id, file);

      return map;
    }, new Map<string, ParsedFile>());

    if (errors.length) {
      throw new Error(errors.join('\n'));
    }

    return files;
  }

  // eslint-disable-next-line class-methods-use-this
  public getIndexFields() {
    const fields = ['title', 'slug', 'path', 'tags', 'description'];
    return {
      fields: [...fields, 'strippedContent'],
      storeFields: fields,
    };
  }

  public buildIndex(): MiniSearch {
    const miniSearch = new MiniSearch({
      ...this.getIndexFields(),
      ...this.options.miniSearchOptions,
    });

    miniSearch.addAll(Array.from(this.files.values()).map((x) => ({ ...x.metadata, ...x })));

    return miniSearch;
  }

  public getFile(id: string): ParsedFile | undefined {
    return this.files.get(id);
  }

  public getFiles(): Map<string, ParsedFile> {
    return this.files;
  }

  public getIndex() {
    return this.miniSearch;
  }

  public indexToJSON(): any {
    return JSON.stringify(this.miniSearch.toJSON());
  }

  public writeIndexJSON(): void {
    writeFileSync(this.getIndexPath(), this.indexToJSON(), 'utf8');
  }

  public getIndexPath(): string {
    return this.options.indexPath || `${this.options.directory}/index.json`;
  }

  public loadIndexJSON() {
    if (this.getIndexPath()) {
      return MiniSearch.loadJSON(readFileSync(this.getIndexPath(), 'utf8'), {
        ...this.getIndexFields(),
        ...this.options.miniSearchOptions,
      });
    }
    throw new Error('No index path provided');
  }

  public getFilePaths(): string[] {
    return this.filePaths;
  }
}
