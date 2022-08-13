import { MarkdownAPI } from '../src';

it('throws errors if required fields are missing', () => {
  const mdapi = new MarkdownAPI({
    directory: 'tests/required-fields',
  });
  expect(mdapi.init).toThrowError();
});
