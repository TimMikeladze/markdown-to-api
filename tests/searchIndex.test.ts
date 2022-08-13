import { MarkdownAPI } from '../src';

describe('search the index', () => {
  let mdapi: MarkdownAPI;
  beforeAll(async () => {
    mdapi = new MarkdownAPI({
      directory: 'tests/basic',
    });
    await mdapi.init();
  });

  it('basic search', async () => {
    const res = mdapi.getIndex().search('hello');
    expect(res).toMatchSnapshot();
    expect(res).toHaveLength(1);
  });

  it('tag search', async () => {
    expect(mdapi.getIndex().search('tag1')).toMatchSnapshot();
  });
});
