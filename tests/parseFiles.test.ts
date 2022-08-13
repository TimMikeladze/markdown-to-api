import { loadFilePaths, parseFiles } from '../src';

describe('parseFiles', () => {
  it('parses yaml content from file paths', async () => {
    const paths = await loadFilePaths('tests/basic');
    const parsedFiles = await parseFiles(paths);
    expect(parsedFiles).toMatchSnapshot();
  });
});
