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

  it('get all files title ascending', () => {
    const res = mdapi.getFiles('title', 'asc');
    expect(res).toMatchSnapshot();
  });

  it('get all files title descending', () => {
    const res = mdapi.getFiles('title', 'desc');
    expect(res).toMatchSnapshot();
  });

  it('get all files createdAt ascending', () => {
    const res = mdapi.getFiles('createdAt', 'asc');
    expect(res).toMatchSnapshot();
  });

  it('get all files createdAt descending', () => {
    const res = mdapi.getFiles('createdAt', 'desc');
    expect(res).toMatchSnapshot();
  });

  it('get all files with limit', () => {
    const res = mdapi.getFiles('createdAt', 'desc', 2);
    expect(res).toHaveLength(2);
  });

  it('get a file', () => {
    const res = mdapi.getFile('hello-world');
    expect(res).toBeDefined();
    expect(res).toMatchSnapshot();
  });

  it('does not return a file', () => {
    const res = mdapi.getFile('basic-dne');
    expect(res).toBeUndefined();
  });

  it('counts files', () => {
    expect(mdapi.countFiles()).toMatchSnapshot();
  });
});
