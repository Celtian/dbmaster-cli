import * as Joi from 'joi';
import { Config, configFactory } from '../config';
import { Fifa, RawData, Table } from '../interfaces';
import { StreamBuilder } from '../utils';

export class SingleTableHandler {
  private config: Config;

  constructor(fifaVersion: Fifa) {
    this.config = configFactory(fifaVersion);
  }

  public async validateTable(table: Table, inputFolder: string): Promise<Joi.ValidationResult[]> {
    const list: Joi.ValidationResult[] = [];
    return new Promise(async (resolve, reject) =>
      new StreamBuilder(inputFolder, table, this.config[table])
        .actionValidate(this.config[table])
        .onData((buffer: Buffer) => list.push(JSON.parse(buffer.toString())))
        .onFinish(() => resolve(list))
        .onError(() => reject(list))
    );
  }

  public async filterTable(
    table: Table,
    inputFolder: string,
    filterFn: (data: RawData) => boolean
  ): Promise<RawData[]> {
    const list: RawData[] = [];
    return new Promise(async (resolve, reject) =>
      new StreamBuilder(inputFolder, table, this.config[table])
        .actionFilter(filterFn)
        .onData((buffer: Buffer) => list.push(JSON.parse(buffer.toString())))
        .onFinish(() => resolve(list))
        .onError(() => reject(list))
    );
  }
}
