import { Command, CommanderStatic } from 'commander';
import { Fifa } from '../lib/interfaces';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input';

export class PlayernameCommand extends AbstractCommand {
  public load(program: CommanderStatic): void {
    program
      .command('playername')
      .description('Minimize playernames table')
      .requiredOption('-f, --fifa <fifa>', `Version of FIFA (${Object.values(Fifa).join(' | ')}).`)
      .requiredOption('-i, --input <path>', 'Path to fifa folder')
      .requiredOption('-o, --output <path>', 'Path to fifa folder')
      .action(async (command: Command) => {
        const options: Input[] = [];
        options.push({ name: 'fifa', value: command.fifa });
        options.push({ name: 'input', value: command.input });
        options.push({ name: 'output', value: command.output });
        await this.action.handle([], options);
      });
  }
}
