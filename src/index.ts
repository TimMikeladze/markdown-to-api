import { globby } from 'globby';
import { readFile } from 'fs/promises';
import matter from 'gray-matter';
import slugify from 'slugify';
import MiniSearch from 'minisearch';
import { remark } from 'remark';
import strip from 'strip-markdown';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { parse } from 'yaml';
import deepmerge from 'deepmerge';

export interface FileData {
  description?: string;
  id: string,
  path: string,
  slug?: string;
  tags?: string[];
  title?: string;
}

export interface ParsedFile {
  content: string;
  data: FileData;
  strippedContent: string;
}

export interface Options {
  config?: any;
  configPath?: string;
  directory: string;
  indexPath?: string;
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

export class MarkdownToGraphQL {
  private static readonly stripper = remark()
    .use(strip);

  private filePaths!: string[];

  private miniSearch!: MiniSearch;

  private files!: Map<string, ParsedFile>;

  private readonly options: Options;

  private readonly config: Config;

  constructor(options: Options) {
    this.options = options;
    this.config = this.loadConfig();
  }

  public async init(): Promise<MarkdownToGraphQL> {
    this.filePaths = await this.loadFilePaths();
    this.files = await this.loadFiles();
    if (existsSync(this.getIndexPath())) {
      this.miniSearch = await this.loadIndexJSON();
    } else {
      this.miniSearch = await this.buildIndex();
    }
    return this;
  }

  public async parseFile(path: string): Promise<ParsedFile> {
    const output = matter(await readFile(path, 'utf8'));

    let {
      data: {
        // eslint-disable-next-line prefer-const
        id, title, slug, tags, description,
      },
    }: {
      data: Partial<FileData>;
    } = output;

    if (!title || !title.trim().length) {
      title = path.split('/').pop()?.split('.').shift();
    }

    if (!slug || !slug.trim().length) {
      slug = slugify(title as string, {
        lower: true,
        strict: true,
      });
    }

    if (!id) {
      const parts = path.split('/');
      id = `${parts.slice(0, parts.length - 1).join('/')}/${slug}`;
    }

    const defaultFieldKeys = Object.keys(defaultConfig.fields || {});

    const extraFieldKeys = Object.keys(this.config.fields || {}).map((x) => (this.config.fields?.[x] && !defaultFieldKeys.includes(x) ? x : null)).filter(Boolean) as string[];

    const extraFields = extraFieldKeys.reduce<Record<string, string>>((res, key) => ({
      ...res,
      [key]: (output.data as any)[key],
    }), {});

    const strippedContent = (await MarkdownToGraphQL.stripper.process(output.content)).toString();

    return {
      data: {
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

  public async loadFilePaths() {
    const paths = await globby(this.options.directory, {
      expandDirectories: {
        files: ['*.md'],
      },
    });
    return paths;
  }

  public async loadFiles(): Promise<Map<string, ParsedFile>> {
    const parsedFiles = await Promise.all(this.filePaths.map((x) => this.parseFile(x)));

    const requiredFields = Object.keys(this.config.fields || {}).map((x) => (this.config.fields?.[x]?.required ? x : null)).filter(Boolean);

    let errors: string[] = [];

    const files = parsedFiles.reduce((map, file) => {
      errors = [
        ...errors,
        ...requiredFields.reduce<string[]>((res, requiredField) => {
          if (requiredField && !((file.data as any)[requiredField])) {
            return [...res, `Missing required field '${requiredField}' in ${file.data.path}`];
          }
          return res;
        }, []),
      ];

      map.set(file.data.id, file);

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

  public async buildIndex(): Promise<MiniSearch> {
    const miniSearch = new MiniSearch({
      ...this.getIndexFields(),
    });

    await miniSearch.addAllAsync(Array.from(this.files.values()).map((x) => ({ ...x.data, ...x })));

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
      });
    }
    throw new Error('No index path provided');
  }

  public getFilePaths(): string[] {
    return this.filePaths;
  }
}
