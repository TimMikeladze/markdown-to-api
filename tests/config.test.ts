import { MarkdownAPI } from '../src';

describe('loadConfig', () => {
  it('uses default config', () => {
    const mdapi = new MarkdownAPI({
      directory: 'tests/cats',
    });
    expect(mdapi.getConfig()).toMatchSnapshot();
  });
  it('auto loads yml config if exists', () => {
    const mdapi = new MarkdownAPI({
      directory: 'tests/cats',
    });
    expect(mdapi.getConfig()).toMatchSnapshot();
  });
  it('loads yml config from path', () => {
    const mdapi = new MarkdownAPI({
      directory: 'tests/cats',
      configPath: 'tests/cats/config.yml',
    });
    expect(mdapi.getConfig()).toMatchSnapshot();
  });
  it('uses js object config', () => {
    const mdapi = new MarkdownAPI({
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
    expect(mdapi.getConfig()).toMatchSnapshot();
  });
  it('js object config and yaml config are equivalent', () => {
    const mdapi1 = new MarkdownAPI({
      directory: 'tests/cats',
      configPath: 'tests/cats/config.yml',
    });
    const mdapi2 = new MarkdownAPI({
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
    expect(mdapi1.getConfig()).toMatchObject(mdapi2.getConfig());
  });
});
