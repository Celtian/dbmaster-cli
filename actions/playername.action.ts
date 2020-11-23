import { Input } from '../commands';
import { Fifa } from '../lib/interfaces';
import { minimizePlayernames } from '../lib/utils';
import { removeUnusedPlayernames } from '../lib/utils/remove-unused-playernames.utils';
import { AbstractAction } from './abstract.action';

export enum PlayernameTypeAction {
  RemoveUnused = 'remove-unused',
  Minimize = 'minimize'
}

export class PlayernameAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const fifa = options.find((option) => option.name === 'fifa');
    const input = options.find((option) => option.name === 'input');
    const output = options.find((option) => option.name === 'output');
    const action = options.find((option) => option.name === 'action-type');

    if (action.value === PlayernameTypeAction.Minimize) {
      await minimizePlayernames(fifa.value as Fifa, input.value as string, output.value as string);
    } else if (action.value === PlayernameTypeAction.RemoveUnused) {
      await removeUnusedPlayernames(fifa.value as Fifa, input.value as string, output.value as string);
    } else {
      console.error('Invalid argument "action-type".');
    }
  }
}
