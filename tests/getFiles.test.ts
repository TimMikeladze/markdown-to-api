import { MarkdownAPI } from '../src/MarkdownAPI';

describe('getFile', () => {
  let mdapi: MarkdownAPI;
  beforeAll(() => {
    mdapi = new MarkdownAPI({
      directory: 'tests/basic',
    });
  });

  it('returns all files', () => {
    const res = mdapi.getFiles();
    expect(res).toMatchSnapshot();
  });

  it('returns a file', () => {
    const res = mdapi.getFile('basic-hello-world');
    expect(res).toBeDefined();
    expect(res).toMatchSnapshot();
  });

  it('does not return a file', () => {
    const res = mdapi.getFile('basic-dne');
    expect(res).toBeUndefined();
  });
});
