import { MarkdownToGraphQL } from '../src';

it('throws errors if required fields are missing', async () => {
  const mg = new MarkdownToGraphQL({
    directory: 'tests/required-fields',
  });
  await expect(mg.init()).rejects.toMatchSnapshot();
});
