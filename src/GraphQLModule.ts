import { createModule, gql } from 'graphql-modules';
import { MarkdownAPI, Options } from './MarkdownAPI';

export const typeDefs = gql`
  type Query {
    markdownFile(id: ID!): MarkdownFile!
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
