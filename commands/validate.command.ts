import { Command, CommanderStatic } from 'commander';
import { Fifa } from '../lib/interfaces';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input';

export class ValidateCommand extends AbstractCommand {
  public load(program: CommanderStatic): void {
    program
      .command('validate')
      .description('Validate Fifa tables')
      .requiredOption('-v, --version <fifa>', `Source version of FIFA (${Object.values(Fifa).join(' | ')}).`)
      .requiredOption('-i, --input <folder>', 'Source folder.')
      .action(async (command: Command) => {
        const options: Input[] = [];
        options.push({ name: 'version', value: command.from });
        options.push({ name: 'output', value: command.output });
        await this.action.handle([], options);
      });
  }
}
