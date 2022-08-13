import { rmSync } from 'fs';
import { MarkdownAPI } from '../src';

describe('loadIndexJSON', () => {
  beforeAll(() => {
    (new MarkdownAPI({
      directory: 'tests/cats',
    }).init()).writeIndexJSON();
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
