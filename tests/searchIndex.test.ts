import { MarkdownAPI } from '../src';

describe('search the index', () => {
  let mdapi: MarkdownAPI;
  beforeAll(() => {
    mdapi = new MarkdownAPI({
      directory: 'tests/basic',
    });
    mdapi.init();
  });

  it('basic search', () => {
    const res = mdapi.getIndex().search('hello');
    expect(res).toMatchSnapshot();
    expect(res).toHaveLength(1);
  });

  it('tag search', () => {
    expect(mdapi.getIndex().search('tag1')).toMatchSnapshot();
  });
});
