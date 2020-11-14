import { Command, CommanderStatic } from 'commander';
import { CompareMode } from '../actions';
import { Fifa, Table } from '../lib/interfaces';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input';

export class CompareCommand extends AbstractCommand {
  public load(program: CommanderStatic): void {
    program
      .command('compare')
      .description('Compare Fifa table definitions')
      .requiredOption('-f, --from <fifa>', `Source version of FIFA (${Object.values(Fifa).join(' | ')}).`)
      .requiredOption('-t, --to <fifa>', `Target version of FIFA (${Object.values(Fifa).join(' | ')}).`)
      .requiredOption('-b, --table <table>', `Selected table (${Object.values(Table).join(' | ')}).`)
      .requiredOption('-m, --mode <mode>', `Selected mode (${Object.values(CompareMode).join(' | ')}).`)
      .action(async (command: Command) => {
        const options: Input[] = [];
        options.push({ name: 'from', value: command.from });
        options.push({ name: 'to', value: command.to });
        options.push({ name: 'table', value: command.table });
        options.push({ name: 'mode', value: command.mode });
        await this.action.handle([], options);
      });
  }
}
