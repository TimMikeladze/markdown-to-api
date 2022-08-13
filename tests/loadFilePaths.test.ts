import { MarkdownAPI } from '../src';

describe('loadFilePaths', () => {
  it('loads all documents in the given path', async () => {
    const mdapi = new MarkdownAPI({
      directory: 'tests/basic',
    });
    const paths = await mdapi.loadFilePaths();
    expect(paths).toMatchSnapshot();
  });
});
