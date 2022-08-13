import { globby } from 'globby';
import { readFile } from 'fs/promises';
import matter from 'gray-matter';
import slugify from 'slugify';
import MiniSearch from 'minisearch';
import { remark } from 'remark';
import strip from 'strip-markdown';

export const loadFilePaths = async (path: string) => {
  const paths = await globby(path, {
    expandDirectories: {
      files: ['*.md'],
    },
  });
  return paths;
};

export interface FileData {
  id: string,
  path: string,
  slug?: string;
  tags?: string[];
  title?: string;
}

export interface ParsedFile {
  content: string;
  data: FileData;
  rawContent: string;
}

const stripper = remark()
  .use(strip);

export const parseFile = async (path: string): Promise<ParsedFile> => {
  const output = matter(await readFile(path, 'utf8'));

  let {
    data: {
      // eslint-disable-next-line prefer-const
      id, title, slug, tags,
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

  const rawContent = (await stripper.process(output.content)).toString();

  return {
    data: {
      id,
      title,
      slug,
      path,
      tags,
    },
    content: output.content,
    rawContent,
  };
};

export const parseFiles = (paths: string[]): Promise<ParsedFile[]> => {
  const files = Promise.all(paths.map(parseFile));
  return files;
};

export const buildIndex = async (files: ParsedFile[]) => {
  const fields = ['title', 'slug', 'path', 'tags'];

  const miniSearch = new MiniSearch({
    fields: [...fields, 'content'],
    storeFields: fields,
  });

  await miniSearch.addAllAsync(files.map((x) => ({ ...x.data, content: x.content })));

  return miniSearch;
};
