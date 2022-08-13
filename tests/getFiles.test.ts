import { MarkdownAPI } from '../src';

describe('getFile', () => {
  let mdapi: MarkdownAPI;
  beforeAll(() => {
    mdapi = new MarkdownAPI({
      directory: 'tests/basic',
    });
    mdapi.init();
  });

  it('returns all files', () => {
    const res = mdapi.getFiles();
    expect(res).toMatchSnapshot();
  });

  it('returns a file', () => {
    const res = mdapi.getFile('tests/basic/hello-world');
    expect(res).toBeDefined();
    expect(res).toMatchSnapshot();
  });

  it('does not return a file', () => {
    const res = mdapi.getFile('tests/basic/dne');
    expect(res).toBeUndefined();
  });
});
