import { CommanderStatic } from 'commander';
import { AbstractCommand } from './abstract.command';

export class InfoCommand extends AbstractCommand {
  public load(program: CommanderStatic): void {
    program
      .command('info')
      .description('Display Cli project details.')
      .action(async () => {
        await this.action.handle();
      });
  }
}
