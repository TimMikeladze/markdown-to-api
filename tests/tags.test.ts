import { MarkdownAPI } from '../src';

it('loads tag from config', () => {
  const mdapi = new MarkdownAPI({
    directory: 'tests/cats',
  });
  expect(mdapi.getTags()).toMatchSnapshot();
});

it('returns empty array if no tags defined in config', () => {
  const mdapi = new MarkdownAPI({
    directory: 'tests/basic',
  });
  expect(mdapi.getTags()).toHaveLength(0);
  expect(mdapi.getTags()).toMatchSnapshot();
});
