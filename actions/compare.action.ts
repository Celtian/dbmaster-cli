import chalk from 'chalk';
import { Input } from '../commands';
import { CompareFifaConfig } from '../lib/fifa-config';
import { Fifa, Table } from '../lib/interfaces';
import { AbstractAction } from './abstract.action';

export enum CompareMode {
  Columns = 'columns',
  Defaults = 'defaults',
  Range = 'range'
}

export class CompareAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const from = options.find((option) => option.name === 'from');
    const to = options.find((option) => option.name === 'to');
    const table = options.find((option) => option.name === 'table');
    const mode = options.find((option) => option.name === 'mode');

    if (!Object.values(Table).includes(table.value as Table)) {
      console.error('Invalid argument "table".');
      return;
    }

    const compare = new CompareFifaConfig(from.value as Fifa, to.value as Fifa);

    switch (mode.value as CompareMode) {
      case CompareMode.Columns:
        console.info(chalk.green(`[${table.value}]`), chalk.blue('comparsion of columns'));
        compare.printDiffColumns(table.value as Table);
        break;
      case CompareMode.Defaults:
        console.info(chalk.green(`[${table.value}]`), chalk.blue('comparsion of defaults'));
        compare.printDiffDefaults(table.value as Table);
        break;
      case CompareMode.Range:
        console.info(chalk.green(`[${table.value}]`), chalk.blue('comparsion of ranges'));
        compare.printDiffRange(table.value as Table);
        break;
      default:
        console.error('Invalid argument "mode".');
        break;
    }
  }
}
