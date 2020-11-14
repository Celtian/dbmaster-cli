import { ActionType } from '../actions';
import { Fifa } from '../interfaces';

export interface ConfigFileInput {
  version: Fifa;
  folder: string;
}

export interface ConfigFileOutput {
  version: Fifa;
  folder: string;
}

export interface ConfigFileAction {
  type: ActionType;
}

export interface ConfigFile {
  input: ConfigFileInput;
  actions: ConfigFileAction[];
  output: ConfigFileOutput;
}
