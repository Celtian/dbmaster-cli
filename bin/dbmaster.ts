#!/usr/bin/env node
import { CommanderStatic, default as commander } from 'commander';
import { CommandLoader } from '../commands';
import { description, version } from '../package.json';

const bootstrap = (): void => {
  const program: CommanderStatic = commander;
  program
    .version(version, '-v, --version', 'Output the current version.')
    .name('dbmaster')
    .description(description)
    .usage('<command> [options]')
    .helpOption('-h, --help', 'Output usage information.');

  CommandLoader.load(program);

  commander.parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
};

bootstrap();
