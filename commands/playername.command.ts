import { Command, CommanderStatic } from 'commander';
import { PlayernameMode } from '../actions/playername.action';
import { Fifa } from '../src/interfaces';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input';

export class PlayernameCommand extends AbstractCommand {
  public load(program: CommanderStatic): void {
    program
      .command('playername')
      .description('Minimize playernames table')
      .requiredOption('-f, --fifa <string>', `Version of FIFA (${Object.values(Fifa).join(' | ')}).`)
      .requiredOption('-i, --input <string>', 'Path to fifa folder')
      .requiredOption('-o, --output <string>', 'Path to fifa folder')
      .requiredOption('-m, --mode <string>', `Mode (${Object.values(PlayernameMode).join(' | ')}).`)
      .action(async (command: Command) => {
        const options: Input[] = [];
        options.push({ name: 'fifa', value: command.fifa });
        options.push({ name: 'input', value: command.input });
        options.push({ name: 'output', value: command.output });
        options.push({ name: 'mode', value: command.mode });
        await this.action.handle([], options);
      });
  }
}
