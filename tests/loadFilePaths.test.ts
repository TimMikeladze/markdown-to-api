import { MarkdownAPI } from '../src';

describe('loadFilePaths', () => {
  it('loads all documents in the given path', () => {
    const mdapi = new MarkdownAPI({
      directory: 'tests/basic',
    });
    const paths = mdapi.loadFilePaths();
    expect(paths).toMatchSnapshot();
  });
});
