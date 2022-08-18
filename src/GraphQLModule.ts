import { createModule, gql } from 'graphql-modules';
import { SearchOptions } from 'minisearch';
import { MarkdownAPI, Options } from './MarkdownAPI';

export const typeDefs = gql`
  type Query {
    markdownFile(id: ID!): MarkdownFile!
    searchMarkdownFiles(text: String! options: MarkdownFileSearchOptions): MarkdownFileSearchResults!
  }

  type MarkdownFile {
    id: ID!
    path: String!
    slug: String!
    tags: [String!]
    title: String!
    description: String
    content: String!
    strippedContent: String!
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
    markdownFile: MarkdownFile!
  }

  input MarkdownFileSearchOptions {
    fields: [String!]
    weights: MarkdownFileSearchOptionsWeights
    prefix: Boolean
    fuzzy: Boolean
    maxFuzzy: Int
    combineWith: MarkdownFileSearchOptionsCombineWith
  }

  enum MarkdownFileSearchOptionsCombineWith {
    AND
    OR
  }

  input MarkdownFileSearchOptionsWeights {
    fuzzy: Float!
    exact: Float!
  }
`;

export const getResolvers = (mdapi: MarkdownAPI) => ({
  Query: {
    markdownFile(_: any, { id }: { id: string }) {
      const file = mdapi.getFile(id);
      if (!file) {
        throw new Error(`File not found: ${id}`);
      }
      return {
        ...file,
        ...file.metadata,
      };
    },
    searchMarkdownFiles(_: any, { text, options }: { options: SearchOptions, text: string }) {
      const results = mdapi.getIndex().search(text, {
        ...mdapi.getOptions(),
        ...options,
      });
      return {
        count: results.length,
        results,
      };
    },
  },
  MarkdownFileSearchResult: {
    markdownFile({ id }: { id: string }) {
      if (!id) {
        throw new Error('selection set is missing id');
      }
      const file = mdapi.getFile(id);
      return {
        ...file,
        ...file!.metadata,
      };
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
