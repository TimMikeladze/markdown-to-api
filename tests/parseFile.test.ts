import { MarkdownAPI } from '../src/MarkdownAPI';

describe('parseFile', () => {
  it('no-slug', () => {
    const mdapi = new MarkdownAPI({
      directory: 'tests/basic',
    });
    const parsedFile = mdapi.parseFile('tests/basic/no-slug.md');
    expect(parsedFile).toMatchSnapshot();
  });
});
