import { MarkdownAPI } from '../src';

it('builds an index', () => {
  const mdapi = new MarkdownAPI({
    directory: 'tests/basic',
  });
  mdapi.init();
  expect(mdapi.getIndex()).toMatchSnapshot();
});
