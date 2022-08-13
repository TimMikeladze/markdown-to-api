import { MarkdownAPI } from '../src';

describe('parseFile', () => {
  it('no-slug', async () => {
    const mdapi = new MarkdownAPI({
      directory: 'tests/basic',
    });
    const parsedFile = await mdapi.parseFile('tests/basic/no-slug.md');
    expect(parsedFile).toMatchSnapshot();
  });
});
