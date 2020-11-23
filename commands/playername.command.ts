import { Command, CommanderStatic } from 'commander';
import { PlayernameTypeAction } from '../actions/playername.action';
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
      .requiredOption(
        '-a, --action-type <type>',
        `Type of action (${Object.values(PlayernameTypeAction).join(' | ')}).`
      )
      .action(async (command: Command) => {
        const options: Input[] = [];
        options.push({ name: 'fifa', value: command.fifa });
        options.push({ name: 'input', value: command.input });
        options.push({ name: 'output', value: command.output });
        options.push({ name: 'action-type', value: command.actionType });
        await this.action.handle([], options);
      });
  }
}
