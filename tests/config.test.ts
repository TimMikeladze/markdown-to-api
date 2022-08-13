import { MarkdownToGraphQL } from '../src';

describe('loadConfig', () => {
  it('uses default config', () => {
    const mg = new MarkdownToGraphQL({
      directory: 'tests/cats',
    });
    expect(mg.getConfig()).toMatchSnapshot();
  });
  it('auto loads yml config if exists', async () => {
    const mg = new MarkdownToGraphQL({
      directory: 'tests/cats',
    });
    expect(mg.getConfig()).toMatchSnapshot();
  });
  it('loads yml config from path', async () => {
    const mg = new MarkdownToGraphQL({
      directory: 'tests/cats',
      configPath: 'tests/cats/config.yml',
    });
    expect(mg.getConfig()).toMatchSnapshot();
  });
  it('uses js object config', async () => {
    const mg = new MarkdownToGraphQL({
      directory: 'tests/cats',
      config: {
        tags:
          {
            cat: null,
            puma: { description: 'Puma is a large cat, also known as a mountain lion.' },
            tiger: { description: 'Tiger is a very large cat.' },
          },
        fields:
          {
            tags: { required: true },
            genus: { required: true },
            url: null,
          },
      },
    });
    expect(mg.getConfig()).toMatchSnapshot();
  });
  it('js object config and yaml config are equivalent', async () => {
    const mg1 = new MarkdownToGraphQL({
      directory: 'tests/cats',
      configPath: 'tests/cats/config.yml',
    });
    const mg2 = new MarkdownToGraphQL({
      directory: 'tests/cats',
      config: {
        tags:
          {
            cat: null,
            puma: { description: 'Puma is a large cat, also known as a mountain lion.' },
            tiger: { description: 'Tiger is a very large cat.' },
          },
        fields:
          {
            tags: { required: true },
            genus: { required: true },
            url: null,
          },
      },
    });
    expect(mg1.getConfig()).toMatchObject(mg2.getConfig());
  });
});
