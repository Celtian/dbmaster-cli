import { Command, CommanderStatic } from 'commander';
import { CompareMode } from '../actions';
import { Fifa, Table } from '../src/interfaces';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input';

export class CompareCommand extends AbstractCommand {
  public load(program: CommanderStatic): void {
    program
      .command('compare')
      .description('Compare Fifa table definitions')
      .requiredOption('-l, --left <string>', `Version of FIFA - left column (${Object.values(Fifa).join(' | ')}).`)
      .requiredOption('-r, --right <string>', `Version of FIFA - right column (${Object.values(Fifa).join(' | ')}).`)
      .requiredOption('-b, --table <string>', `Selected table (${Object.values(Table).join(' | ')}).`)
      .requiredOption('-m, --mode <string>', `Selected mode (${Object.values(CompareMode).join(' | ')}).`)
      .action(async (command: Command) => {
        const options: Input[] = [];
        options.push({ name: 'left', value: command.left });
        options.push({ name: 'right', value: command.right });
        options.push({ name: 'table', value: command.table });
        options.push({ name: 'mode', value: command.mode });
        await this.action.handle([], options);
      });
  }
}
