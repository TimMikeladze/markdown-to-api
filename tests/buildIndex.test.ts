import {
  buildIndex,
  loadFilePaths, ParsedFile, parseFiles,
} from '../src';

describe('buildIndex', () => {
  let files: ParsedFile[];
  beforeAll(async () => {
    const paths = await loadFilePaths('tests/basic');
    files = await parseFiles(paths);
  });

  it('builds an index', async () => {
    const index = await buildIndex(files);
    expect(index).toMatchSnapshot();
  });
});
