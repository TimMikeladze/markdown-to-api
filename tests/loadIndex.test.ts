import { rmSync } from 'fs';
import { jest } from '@jest/globals';
import { MarkdownAPI } from '../src/MarkdownAPI';

describe('loadIndexJSON', () => {
  let spy: any;
  beforeAll(() => {
    spy = jest.spyOn(MarkdownAPI.prototype, 'loadIndexJSON');

    new MarkdownAPI({
      directory: 'tests/cats',
    }).writeIndexJSON();
  });

  afterAll(() => {
    jest.restoreAllMocks();
    rmSync('tests/cats/index.json');
  });

  it('loads index', () => {
    const mdapi = new MarkdownAPI({
      directory: 'tests/cats',
      useIndex: true,
    });

    expect(spy).toHaveBeenCalled();

    expect(mdapi.loadIndexJSON()).toMatchSnapshot();
  });
});

describe('skips loading index if useIndex = false', () => {
  let spy: any;
  beforeAll(() => {
    spy = jest.spyOn(MarkdownAPI.prototype, 'loadIndexJSON');

    new MarkdownAPI({
      directory: 'tests/cats',
    }).writeIndexJSON();
  });

  afterAll(() => {
    jest.restoreAllMocks();
    rmSync('tests/cats/index.json');
  });

  it('loads index', () => {
    // eslint-disable-next-line no-new
    new MarkdownAPI({
      directory: 'tests/cats',
      useIndex: false,
    });

    expect(spy).not.toHaveBeenCalled();
  });
});
