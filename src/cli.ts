import { Command } from 'commander';
import { MarkdownAPI } from './MarkdownAPI';

const program = new Command();

program
  .name('markdown-to-api')
  .description('CLI to interact with markdown-to-api');

program.requiredOption(
  '-d --directory <folder>',
  'Path to the folder containing the markdown files',
);

program.option(
  '-c --configPath <configPath>',
  'Path to the config file',
);

program.option(
  '-i --indexPath <indexPath>',
  'Path to the index file',
);

try {
  const res = program.parse(process.argv);

  const mdapi = new MarkdownAPI(res.opts());

  mdapi.writeIndexJSON();

  // eslint-disable-next-line no-console
  console.log(`Search index written to: ${mdapi.getIndexPath()}`);
} catch (err: any) {
  // eslint-disable-next-line no-console
  console.error(err.message);
}
