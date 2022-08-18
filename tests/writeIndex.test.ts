import { existsSync, rmSync } from 'fs';
import { MarkdownAPI } from '../src/MarkdownAPI';

describe('writeIndexJSON', () => {
  afterAll(() => {
    rmSync('tests/cats/index.json');
  });

  it('writes an index', () => {
    // eslint-disable-next-line no-new
    new MarkdownAPI({
      directory: 'tests/cats',
      writeIndex: true,
    });

    expect(existsSync('tests/cats/index.json')).toBe(true);
  });

  it('throws error if index does not exist', () => {
    const mdapi = new MarkdownAPI({
      directory: 'tests/cats',
    });
    expect(mdapi.loadIndexJSON).toThrowError();
  });
});
