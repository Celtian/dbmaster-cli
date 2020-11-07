import { Command, CommanderStatic } from 'commander';
import { Fifa } from '../lib/interfaces';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input';

export class ConvertCommand extends AbstractCommand {
  public load(program: CommanderStatic): void {
    program
      .command('convert')
      .description('Convert Fifa tables')
      .requiredOption('-f, --from <fifa>', `Source version of FIFA (${Object.values(Fifa).join(' | ')}).`)
      .requiredOption('-t, --to <fifa>', `Target version of FIFA (${Object.values(Fifa).join(' | ')}).`)
      .requiredOption('-i, --input <folder>', 'Source folder.')
      .requiredOption('-o, --output <folder>', 'Target folder.')
      .action(async (command: Command) => {
        const options: Input[] = [];
        options.push({ name: 'from', value: command.from });
        options.push({ name: 'to', value: command.to });
        options.push({ name: 'input', value: command.input });
        options.push({ name: 'output', value: command.output });
        await this.action.handle([], options);
      });
  }
}
