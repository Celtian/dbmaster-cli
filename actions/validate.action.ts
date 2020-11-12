import chalk from 'chalk';
import { Input } from '../commands';
import { SingleTableHandler } from '../lib/handlers/single-table.handler';
import { Fifa, Table } from '../lib/interfaces';
import { AbstractAction } from './abstract.action';

export class ValidateAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const version = options.find((option) => option.name === 'version');
    const input = options.find((option) => option.name === 'input');

    const validationManager = new SingleTableHandler(version.value as Fifa);
    for (const table of Object.values(Table)) {
      console.info(chalk.green(`[${table}]`));
      const list = await validationManager.validateTable(table, input.value as string);
      console.info('Errors  :', chalk.blue(list.filter((v) => v.error || v.errors).length));
      console.info('Warning :', chalk.blue(list.filter((v) => v.warning).length));
      console.info('Valid   :', chalk.blue(list.filter((v) => !v.error && !v.errors && !v.warning).length));
    }
  }
}
