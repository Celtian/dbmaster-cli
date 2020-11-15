import chalk from 'chalk';
import { Input } from '../commands';
import { actionFactory } from '../lib/actions';
import { configFactory } from '../lib/config';
import { Table } from '../lib/interfaces';
import { AbstractAction } from './abstract.action';

export class ConvertAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const path = options.find((option) => option.name === 'config').value as string;
    const cfg = configFactory(path);
    for (const table of Object.values(Table)) {
      console.info(chalk.green(`[${table}]`));
      const list = await actionFactory(cfg.tableConfig(table));
      console.info('Converted :', chalk.yellow(list.length));
    }
  }
}
