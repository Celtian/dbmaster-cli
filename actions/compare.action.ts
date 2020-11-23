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
    const left = options.find((option) => option.name === 'left').value as Fifa;
    const right = options.find((option) => option.name === 'right').value as Fifa;
    const table = options.find((option) => option.name === 'table').value as Table;
    const mode = options.find((option) => option.name === 'mode').value as CompareMode;

    if (!Object.values(Table).includes(table)) {
      console.error('Invalid argument "table".');
      return;
    }

    const compare = new CompareFifaConfig(left, right);

    switch (mode) {
      case CompareMode.Column:
        console.info(chalk.green(`[${table}]`), chalk.yellow('Is the column present?'));
        compare.printDiffColumns(table);
        break;
      case CompareMode.Default:
        console.info(chalk.green(`[${table}]`), chalk.yellow('What is the default value of the column?'));
        compare.printDiffDefaults(table);
        break;
      case CompareMode.Order:
        console.info(chalk.green(`[${table}]`), chalk.yellow('What is the correct order of the column?'));
        compare.printDiffOrder(table);
        break;
      case CompareMode.Range:
        console.info(chalk.green(`[${table}]`), chalk.yellow('What is the range of the integer column?'));
        compare.printDiffRange(table);
        break;
      case CompareMode.Type:
        console.info(chalk.green(`[${table}]`), chalk.yellow('What is the correct datatype of the column?'));
        compare.printDiffDatatype(table);
        break;
      default:
        console.error('Invalid argument "mode".');
        break;
    }
  }
}
