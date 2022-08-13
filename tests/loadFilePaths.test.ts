import { loadFilePaths } from '../src';

describe('loadFilePaths', () => {
  it('loads all documents in the given path', async () => {
    const paths = await loadFilePaths('tests/basic');
    expect(paths).toMatchSnapshot();
  });
});
