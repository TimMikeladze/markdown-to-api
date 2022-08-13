import { MarkdownAPI } from '../src';

it('builds an index', async () => {
  const mdapi = new MarkdownAPI({
    directory: 'tests/basic',
  });
  await mdapi.init();
  expect(mdapi.getIndex()).toMatchSnapshot();
});
