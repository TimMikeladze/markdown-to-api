import { MarkdownToGraphQL } from '../src';

describe('loadFilePaths', () => {
  it('loads all documents in the given path', async () => {
    const mg = new MarkdownToGraphQL({
      directory: 'tests/basic',
    });
    const paths = await mg.loadFilePaths();
    expect(paths).toMatchSnapshot();
  });
});
