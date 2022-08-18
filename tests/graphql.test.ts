import { print } from 'graphql';
import { createMarkdownAPIModule, MarkdownAPI, getResolvers } from '../src';

describe('createMarkdownAPIModule', () => {
  it('creates a GraphQLModule', () => {
    const module = createMarkdownAPIModule({
      directory: 'tests/cats',
    });

    expect(print(module.typeDefs as any)).toMatchSnapshot();
  });

  it('can query for a file', async () => {
    const mdapi = new MarkdownAPI({
      directory: 'tests/cats',
    });
    const file = getResolvers(mdapi).Query.markdownFile({}, { id: 'pumas-cougar' });
    expect(file).toMatchSnapshot();
  });

  it('throws error if file not found', async () => {
    const mdapi = new MarkdownAPI({
      directory: 'tests/cats',
    });
    expect(() => getResolvers(mdapi).Query.markdownFile({}, { id: 'dne' })).toThrowError();
  });

  it('can search for files', async () => {
    const mdapi = new MarkdownAPI({
      directory: 'tests/cats',
    });
    const res = getResolvers(mdapi).Query.searchMarkdownFiles({}, { text: 'cat' });
    expect(res).toMatchSnapshot();
  });

  it('can autosuggest search terms', async () => {
    const mdapi = new MarkdownAPI({
      directory: 'tests/cats',
    });
    const res = getResolvers(mdapi).Query.autoSuggestMarkdownFileSearch({}, { text: 'cat tiger' });
    expect(res).toMatchSnapshot();
  });
});
