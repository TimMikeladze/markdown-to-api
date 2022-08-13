import { MarkdownAPI } from '../src';

it('throws errors if required fields are missing', async () => {
  const mdapi = new MarkdownAPI({
    directory: 'tests/required-fields',
  });
  await expect(mdapi.init()).rejects.toMatchSnapshot();
});
