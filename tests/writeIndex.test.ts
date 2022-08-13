import { existsSync, rmSync } from 'fs';
import { MarkdownAPI } from '../src';

describe('writeIndexJSON', () => {
  afterAll(() => {
    rmSync('tests/cats/index.json');
  });

  it('writes an index', async () => {
    const mdapi = new MarkdownAPI({
      directory: 'tests/cats',
    });
    await mdapi.init();
    await mdapi.writeIndexJSON();
    expect(existsSync('tests/cats/index.json')).toBe(true);
  });

  it('throws error if index does not exist', async () => {
    const mdapi = new MarkdownAPI({
      directory: 'tests/cats',
    });
    expect(mdapi.loadIndexJSON).toThrowError();
  });
});
