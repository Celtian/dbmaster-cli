import { Input } from '../commands';
import { Fifa } from '../src/interfaces';
import { minimizePlayernames } from '../src/utils';
import { removeUnusedPlayernames } from '../src/utils/remove-unused-playernames.utils';
import { AbstractAction } from './abstract.action';

export enum PlayernameMode {
  RemoveUnused = 'remove-unused',
  Minimize = 'minimize'
}

export class PlayernameAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]): Promise<void> {
    const fifa = options.find((option) => option.name === 'fifa').value as Fifa;
    const input = options.find((option) => option.name === 'input').value as string;
    const output = options.find((option) => option.name === 'output').value as string;
    const mode = options.find((option) => option.name === 'mode').value as PlayernameMode;

    if (mode === PlayernameMode.Minimize) {
      await minimizePlayernames(fifa, input, output);
    } else if (mode === PlayernameMode.RemoveUnused) {
      await removeUnusedPlayernames(fifa, input, output);
    } else {
      console.error('Invalid argument "mode".');
    }
  }
}
