import { rmSync } from 'fs';
import { MarkdownAPI } from '../src';

describe('loadIndexJSON', () => {
  beforeAll(async () => {
    (await new MarkdownAPI({
      directory: 'tests/cats',
    }).init()).writeIndexJSON();
  });

  afterAll(() => {
    rmSync('tests/cats/index.json');
  });

  it('loads index', async () => {
    const mdapi = new MarkdownAPI({
      directory: 'tests/cats',
    });
    expect(mdapi.loadIndexJSON()).toMatchSnapshot();
  });
});
