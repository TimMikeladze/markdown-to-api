import { MarkdownAPI } from '../src/MarkdownAPI';

describe('files', () => {
  let mdapi: MarkdownAPI;
  beforeAll(() => {
    mdapi = new MarkdownAPI({
      directory: 'tests/basic',
    });
  });

  it('return file map', () => {
    const res = mdapi.getFileMap();
    expect(res).toMatchSnapshot();
  });

  it('get all files ascending', () => {
    const res = mdapi.getFiles('asc');
    expect(res).toMatchSnapshot();
  });

  it('get all files descending', () => {
    const res = mdapi.getFiles('desc');
    expect(res).toMatchSnapshot();
  });

  it('get all files with limit', () => {
    const res = mdapi.getFiles('desc', 2);
    expect(res).toHaveLength(2);
  });

  it('get a file', () => {
    const res = mdapi.getFile('basic-hello-world');
    expect(res).toBeDefined();
    expect(res).toMatchSnapshot();
  });

  it('does not return a file', () => {
    const res = mdapi.getFile('basic-dne');
    expect(res).toBeUndefined();
  });
});
