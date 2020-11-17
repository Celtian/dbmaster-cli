import chalk from 'chalk';
import { Input } from '../commands';
import { CompareFifaConfig } from '../lib/fifa-config';
import { Fifa, Table } from '../lib/interfaces';
import { AbstractAction } from './abstract.action';

export enum CompareMode {
  Column = 'column',
  Default = 'default',
  Order = 'order',
  Range = 'range',
  Type = 'type'
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
      case CompareMode.Column:
        console.info(chalk.green(`[${table.value}]`), chalk.yellow('Is the column present?'));
        compare.printDiffColumns(table.value as Table);
        break;
      case CompareMode.Default:
        console.info(chalk.green(`[${table.value}]`), chalk.yellow('What is the default value of the column?'));
        compare.printDiffDefaults(table.value as Table);
        break;
      case CompareMode.Order:
        console.info(chalk.green(`[${table.value}]`), chalk.yellow('What is the correct order of the column?'));
        compare.printDiffOrder(table.value as Table);
        break;
      case CompareMode.Range:
        console.info(chalk.green(`[${table.value}]`), chalk.yellow('What is the range of the integer column?'));
        compare.printDiffRange(table.value as Table);
        break;
      case CompareMode.Type:
        console.info(chalk.green(`[${table.value}]`), chalk.yellow('What is the correct datatype of the column?'));
        compare.printDiffDatatype(table.value as Table);
        break;
      default:
        console.error('Invalid argument "mode".');
        break;
    }
  }
}
