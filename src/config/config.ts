import { ActionFactoryOptions } from '../actions';
import { FifaConfig, fifaConfigFactory } from '../fifa-config';
import { Table } from '../interfaces';
import { ConfigFile } from './interfaces';

export class Config {
  private inputConfig: FifaConfig;
  private outputConfig: FifaConfig;

  constructor(private configFile: ConfigFile) {
    this.inputConfig = fifaConfigFactory(this.configFile.input.version);
    this.outputConfig = this.configFile.output ? fifaConfigFactory(this.configFile.output.version) : this.inputConfig;
  }

  public tableConfig(table: Table): ActionFactoryOptions {
    return {
      input: {
        ...this.configFile.input,
        fields: this.inputConfig[table]
      },
      output: this.configFile.output
        ? {
            ...this.configFile.output,
            fields: this.outputConfig[table]
          }
        : null,
      table,
      actions: this.configFile.actions
    };
  }
}
