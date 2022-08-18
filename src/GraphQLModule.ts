import { createModule, gql } from 'graphql-modules';
import { SearchOptions } from 'minisearch';
import { MarkdownAPI, Options } from './MarkdownAPI';

export const typeDefs = gql`
  type Query {
    countMarkdownFiles: Int
    markdownFile(id: ID!): MarkdownFile!
    markdownFiles(direction: MarkdownFilesSortDirection limit: Int offset: Int): [MarkdownFile!]!
    searchMarkdownFiles(
      text: String!
      options: MarkdownFileSearchOptions
      limit: Int
      offset: Int):
    MarkdownFileSearchResults!
    autoSuggestMarkdownFileSearch(text: String! options: MarkdownFileSearchOptions): MarkdownFileAutoSuggestResults!
    markdownFileTags: [MarkdownFileTag!]!
  }

  type MarkdownFile {
    content: String!
    strippedContent: String!
    id: ID!
    path: String!
    slug: String!
    tags: [String!]
    title: String!
    description: String
    createdAt: String!
  }

  type MarkdownFileSearchResults {
    count: Int!
    results: [MarkdownFileSearchResult!]!
  }

  type MarkdownFileSearchResult {
    id: ID!
    description: String
    score: Float!
    terms: [String!]
    title: String!
    slug: String!
    path: String!
    tags: [String!]
    createdAt: String!
    markdownFile: MarkdownFile!
  }

  type MarkdownFileTag {
    name: String!
    description: String
  }

  input MarkdownFileSearchOptions {
    fields: [String!]
    weights: MarkdownFileSearchOptionsWeights
    prefix: Boolean
    fuzzy: Boolean
    maxFuzzy: Int
    combineWith: MarkdownFileSearchOptionsCombineWith
  }

  type MarkdownFileAutoSuggestResults {
    count: Int!
    results: [MarkdownFileAutoSuggestResult!]!
  }

  type MarkdownFileAutoSuggestResult {
    suggestion: String!
    terms: [String!]!
    score: Float!
  }

  enum MarkdownFileSearchOptionsCombineWith {
    AND
    OR
  }

  input MarkdownFileSearchOptionsWeights {
    fuzzy: Float!
    exact: Float!
  }

  enum MarkdownFilesSortDirection {
    asc
    desc
  }

  enum MarkdownFilesSortBy {
    title
    createdAt
  }
`;

export const getResolvers = (mdapi: MarkdownAPI) => ({
  Query: {
    countMarkdownFiles() {
      return mdapi.countFiles();
    },
    markdownFileTags() {
      return mdapi.getTags();
    },
    markdownFile(_: any, { id }: { id: string }) {
      const file = mdapi.getFile(id);
      if (!file) {
        throw new Error(`File not found: ${id}`);
      }
      return file;
    },
    autoSuggestMarkdownFileSearch(_: any, { text, options }: { options?: SearchOptions, text: string; }) {
      const results = mdapi.getIndex().autoSuggest(text, {
        ...mdapi.getOptions(),
        ...options,
      });
      return {
        count: results.length,
        results,
      };
    },
    searchMarkdownFiles(_: any, {
      text, options, limit, offset,
    }: { limit?: number, offset?: number; options?: SearchOptions, text: string }) {
      const results = mdapi.getIndex().search(text, {
        ...mdapi.getOptions(),
        ...options,
      }).slice(offset || 0, limit);
      return {
        count: results.length,
        results,
      };
    },
    markdownFiles(
      _: any,
      {
        sortBy, direction, limit, offset,
      }:
        { direction: 'asc' | 'desc', limit?: number, offset?: number, sortBy: 'createdAt' | 'title' },
    ) {
      return mdapi.getFiles(sortBy, direction, limit, offset);
    },
  },
  MarkdownFileSearchResult: {
    markdownFile({ id }: { id: string }) {
      if (!id) {
        throw new Error('selection set is missing id');
      }
      const file = mdapi.getFile(id);
      return file;
    },
  },
});

export const createMarkdownAPIModule = (options: Options) => {
  const mdapi = new MarkdownAPI(options);

  return createModule({
    id: 'MarkdownAPIModule',
    typeDefs,
    resolvers: getResolvers(mdapi),
  });
};
