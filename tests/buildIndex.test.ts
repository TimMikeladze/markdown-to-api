import { MarkdownAPI } from '../src/MarkdownAPI';

it('builds an index', () => {
  const mdapi = new MarkdownAPI({
    directory: 'tests/basic',
  });

  expect(mdapi.getIndex()).toMatchSnapshot();
});
