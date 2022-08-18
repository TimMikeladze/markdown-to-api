import { MarkdownAPI } from '../src/MarkdownAPI';

it('throws errors if required fields are missing', () => {
  expect(() => new MarkdownAPI({
    directory: 'tests/required-fields',
  })).toThrowError();
});
