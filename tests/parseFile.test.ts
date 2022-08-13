import { MarkdownToGraphQL } from '../src';

describe('parseFile', () => {
  it('no-slug', async () => {
    const mg = new MarkdownToGraphQL({
      directory: 'tests/basic',
    });
    const parsedFile = await mg.parseFile('tests/basic/no-slug.md');
    expect(parsedFile).toMatchSnapshot();
  });
});
