import { MarkdownToGraphQL } from '../src';

describe('getFile', () => {
  let mg: MarkdownToGraphQL;
  beforeAll(async () => {
    mg = new MarkdownToGraphQL({
      directory: 'tests/basic',
    });
    await mg.init();
  });

  it('returns all files', async () => {
    const res = mg.getFiles();
    expect(res).toMatchSnapshot();
  });

  it('returns a file', async () => {
    const res = mg.getFile('tests/basic/hello-world');
    expect(res).toBeDefined();
    expect(res).toMatchSnapshot();
  });

  it('does not return a file', async () => {
    const res = mg.getFile('tests/basic/dne');
    expect(res).toBeUndefined();
  });
});
