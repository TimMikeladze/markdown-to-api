import { MarkdownToGraphQL } from '../src';

describe('buildIndex', () => {
  it('builds an index', async () => {
    const mg = new MarkdownToGraphQL({
      directory: 'tests/basic',
    });
    await mg.init();
    expect(mg.getIndex()).toMatchSnapshot();
  });
});
