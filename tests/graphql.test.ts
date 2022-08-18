import { createMarkdownAPIModule, MarkdownAPI, getResolvers } from '../src';

describe('GraphQLModule', () => {
  it('creates a GraphQLModule', () => {
    const module = createMarkdownAPIModule({
      directory: 'tests/cats',
    });

    expect(module.typeDefs).toMatchSnapshot();
  });

  it('can query for a file', async () => {
    const mdapi = new MarkdownAPI({
      directory: 'tests/cats',
    });
    const file = getResolvers(mdapi).Query.markdownFile({}, { id: 'cats/pumas/messi' });
    expect(file).toMatchSnapshot();
  });

  it('throws error if file not found', async () => {
    const mdapi = new MarkdownAPI({
      directory: 'tests/cats',
    });
    expect(() => getResolvers(mdapi).Query.markdownFile({}, { id: 'dne' })).toThrowError();
  });
});
