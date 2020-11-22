import chalk from 'chalk';
import { CommanderStatic } from 'commander';
import { CompareAction, ConvertAction, InfoAction } from '../actions';
import { DistributionAction } from '../actions/distribution.action';
import { PlayernameAction } from '../actions/playername.action';
import { ERROR_PREFIX } from '../lib/ui';
import { CompareCommand } from './compare.command';
import { ConvertCommand } from './convert.command';
import { DistributionCommand } from './distribution.command';
import { InfoCommand } from './info.command';
import { PlayernameCommand } from './playername.command';

export class CommandLoader {
  public static load(program: CommanderStatic): void {
    new CompareCommand(new CompareAction()).load(program);
    new ConvertCommand(new ConvertAction()).load(program);
    new DistributionCommand(new DistributionAction()).load(program);
    new InfoCommand(new InfoAction()).load(program);
    new PlayernameCommand(new PlayernameAction()).load(program);
    this.handleInvalidCommand(program);
  }

  private static handleInvalidCommand(program: CommanderStatic): void {
    program.on('command:*', () => {
      console.error(`\n${ERROR_PREFIX} Invalid command: ${chalk.red('%s')}`, program.args.join(' '));
      console.log(`See ${chalk.red('--help')} for a list of available commands.\n`);
      process.exit(1);
    });
  }
}
