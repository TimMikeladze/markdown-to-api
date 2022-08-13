import { MarkdownToGraphQL } from '../src';

it('builds an index', async () => {
  const mg = new MarkdownToGraphQL({
    directory: 'tests/basic',
  });
  await mg.init();
  expect(mg.getIndex()).toMatchSnapshot();
});
