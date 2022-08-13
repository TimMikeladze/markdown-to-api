import { existsSync, rmSync } from 'fs';
import { MarkdownToGraphQL } from '../src';

describe('writeIndexJSON', () => {
  afterAll(() => {
    rmSync('tests/cats/index.json');
  });

  it('writes an index', async () => {
    const mg = new MarkdownToGraphQL({
      directory: 'tests/cats',
    });
    await mg.init();
    await mg.writeIndexJSON();
    expect(existsSync('tests/cats/index.json')).toBe(true);
  });

  it('throws error if index does not exist', async () => {
    const mg = new MarkdownToGraphQL({
      directory: 'tests/cats',
    });
    expect(mg.loadIndexJSON).toThrowError();
  });
});
