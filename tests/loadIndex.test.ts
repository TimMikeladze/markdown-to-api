import { rmSync } from 'fs';
import { MarkdownToGraphQL } from '../src';

describe('loadIndexJSON', () => {
  beforeAll(async () => {
    (await new MarkdownToGraphQL({
      directory: 'tests/cats',
    }).init()).writeIndexJSON();
  });

  afterAll(() => {
    rmSync('tests/cats/index.json');
  });

  it('loads index', async () => {
    const mg = new MarkdownToGraphQL({
      directory: 'tests/cats',
    });
    expect(mg.loadIndexJSON()).toMatchSnapshot();
  });
});
