import { Config, configFactory } from '../config';
import { Fifa, RawData, Table } from '../interfaces';
import { StreamBuilder } from '../utils';

export class MultiTableHandler {
  private sourceConfig: Config;
  private targetConfig: Config;

  constructor(sourceVersion: Fifa, targetVersion: Fifa) {
    this.sourceConfig = configFactory(sourceVersion);
    this.targetConfig = configFactory(targetVersion);
  }

  public async convertTable(table: Table, inputFolder: string, outputFolder: string): Promise<RawData[]> {
    const list: RawData[] = [];
    return new Promise(async (resolve, reject) =>
      new StreamBuilder(inputFolder, table, this.sourceConfig[table])
        .actionAppendDefault(this.targetConfig[table])
        .onData((buffer: Buffer) => list.push(JSON.parse(buffer.toString())))
        .actionWrite(outputFolder, this.targetConfig[table])
        .onFinish(() => resolve(list))
        .onError(() => reject(list))
    );
  }
}
