import chalk from 'chalk';
import { Input } from '../commands';
import { CompareManager } from '../lib/handlers';
import { Fifa, Table } from '../lib/interfaces';
import { AbstractAction } from './abstract.action';

export class CompareAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const from = options.find((option) => option.name === 'from');
    const to = options.find((option) => option.name === 'to');
    const compare = new CompareManager(from.value as Fifa, to.value as Fifa);
    for (const table of Object.values(Table)) {
      console.info(chalk.green(`[${table}]`));
      const diff = compare.compareTableDefinition(table);
      console.info(`Columns only in ${from.value}   :`, chalk.blue(diff.firstTable.join(', ')));
      console.info(`Columns only in ${to.value}   :`, chalk.blue(diff.secondTable.join(', ')));
      console.info('Columns in both versions :', chalk.blue(diff.bothTables.join(', ')));
    }
  }
}
