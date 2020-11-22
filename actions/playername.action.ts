import { Input } from '../commands';
import { Fifa } from '../lib/interfaces';
import { minimizePlayernames } from '../lib/utils';
import { AbstractAction } from './abstract.action';

export class PlayernameAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const fifa = options.find((option) => option.name === 'fifa');
    const input = options.find((option) => option.name === 'input');
    const output = options.find((option) => option.name === 'output');
    await minimizePlayernames(fifa.value as Fifa, input.value as string, output.value as string);
  }
}
