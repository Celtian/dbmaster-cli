import { Command, CommanderStatic } from 'commander';
import { Fifa, Table } from '../src/interfaces';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input';

export class DistributionCommand extends AbstractCommand {
  public load(program: CommanderStatic): void {
    program
      .command('distribution')
      .description('Anylyze distribution of Fifa table')
      .requiredOption('-i, --input <string>', 'Path to fifa folder')
      .requiredOption('-f, --fifa <string>', `Source version of FIFA (${Object.values(Fifa).join(' | ')}).`)
      .requiredOption('-t, --table <string>', `Selected table (${Object.values(Table).join(' | ')}).`)
      .option('-c, --column <string>', `Selected column.`)
      .action(async (command: Command) => {
        const options: Input[] = [];
        options.push({ name: 'input', value: command.input });
        options.push({ name: 'table', value: command.table });
        options.push({ name: 'fifa', value: command.fifa });
        options.push({ name: 'column', value: command.column });
        await this.action.handle([], options);
      });
  }
}
