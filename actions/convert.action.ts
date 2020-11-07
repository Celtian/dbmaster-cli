import chalk from 'chalk';
import { Input } from '../commands';
import { Fifa, Table } from '../lib/interfaces';
import { ConvertManager } from '../lib/managers';
import { AbstractAction } from './abstract.action';

export class ConvertAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const from = options.find((option) => option.name === 'from');
    const to = options.find((option) => option.name === 'to');
    const input = options.find((option) => option.name === 'input');
    const output = options.find((option) => option.name === 'output');

    const converter = new ConvertManager(from.value as Fifa, to.value as Fifa);
    for (const table of Object.values(Table)) {
      console.info(chalk.green(`[${table}]`));
      const list = await converter.convertTable(table, input.value as string, output.value as string);
      console.info('Converted :', chalk.blue(list.length));
    }
  }
}
