import { MarkdownAPI } from '../src';

describe('getFile', () => {
  let mdapi: MarkdownAPI;
  beforeAll(async () => {
    mdapi = new MarkdownAPI({
      directory: 'tests/basic',
    });
    await mdapi.init();
  });

  it('returns all files', async () => {
    const res = mdapi.getFiles();
    expect(res).toMatchSnapshot();
  });

  it('returns a file', async () => {
    const res = mdapi.getFile('tests/basic/hello-world');
    expect(res).toBeDefined();
    expect(res).toMatchSnapshot();
  });

  it('does not return a file', async () => {
    const res = mdapi.getFile('tests/basic/dne');
    expect(res).toBeUndefined();
  });
});
