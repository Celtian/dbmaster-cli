import { Command, CommanderStatic } from 'commander';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input';

export class ConvertCommand extends AbstractCommand {
  public load(program: CommanderStatic): void {
    program
      .command('convert')
      .description('Convert Fifa tables')
      .requiredOption('-c, --config <path>', 'Path to config.yml')
      .action(async (command: Command) => {
        const options: Input[] = [];
        options.push({ name: 'config', value: command.config });
        await this.action.handle([], options);
      });
  }
}
