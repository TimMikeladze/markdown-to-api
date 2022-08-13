import { MarkdownToGraphQL } from '../src';

describe('search the index', () => {
  let mg: MarkdownToGraphQL;
  beforeAll(async () => {
    mg = new MarkdownToGraphQL({
      directory: 'tests/basic',
    });
    await mg.init();
  });

  it('basic search', async () => {
    const res = mg.getIndex().search('hello');
    expect(res).toMatchSnapshot();
    expect(res).toHaveLength(1);
  });

  it('tag search', async () => {
    expect(mg.getIndex().search('tag1')).toMatchSnapshot();
  });
});
