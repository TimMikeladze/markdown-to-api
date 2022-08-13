import { parseFile } from '../src';

describe('parseFile', () => {
  it('no-slug', async () => {
    const path = 'tests/basic/no-slug.md';
    const parsedFile = await parseFile(path);
    expect(parsedFile).toMatchSnapshot();
  });
});
