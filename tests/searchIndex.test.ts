import MiniSearch from 'minisearch';
import { buildIndex, loadFilePaths, parseFiles } from '../src';

describe('search the index', () => {
  let index: MiniSearch;
  beforeAll(async () => {
    const paths = await loadFilePaths('tests/basic');
    const files = await parseFiles(paths);
    index = await buildIndex(files);
  });

  it('basic search', async () => {
    const res = index.search('hello');
    expect(res).toMatchSnapshot();
    expect(res).toHaveLength(1);
  });

  it('tag search', async () => {
    expect(index.search('tag1')).toMatchSnapshot();
  });
});
