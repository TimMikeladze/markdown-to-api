import { rmSync } from 'fs';
import { MarkdownAPI } from '../src/MarkdownAPI';

describe('loadIndexJSON', () => {
  beforeAll(() => {
    new MarkdownAPI({
      directory: 'tests/cats',
    }).writeIndexJSON();
  });

  afterAll(() => {
    rmSync('tests/cats/index.json');
  });

  it('loads index', () => {
    const mdapi = new MarkdownAPI({
      directory: 'tests/cats',
    });
    expect(mdapi.loadIndexJSON()).toMatchSnapshot();
  });
});
