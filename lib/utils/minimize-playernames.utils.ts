import { StreamBuilder } from '../actions';
import { FifaConfig, fifaConfigFactory } from '../fifa-config';
import { Field, Fifa, Table } from '../interfaces';
import { ReindexMap } from './reindex.utils';

const writePlayers = async (
  table: Table,
  fields: Field[],
  reindexMap: ReindexMap[],
  inputFolder: string,
  outputFolder: string
): Promise<any> => {
  return new Promise(async (resolve, reject) =>
    new StreamBuilder(inputFolder, table, fields).actionApplyPlayernames(reindexMap).actionWrite(outputFolder, fields)
  );
};

const writePlayernames = async (
  table: Table,
  fields: Field[],
  inputFolder: string,
  outputFolder: string
): Promise<ReindexMap[]> => {
  const list: ReindexMap[] = [];
  return new Promise(async (resolve, reject) =>
    new StreamBuilder(inputFolder, table, fields)
      .actionReindex(0)
      .onData((buffer: Buffer) => list.push(JSON.parse(buffer.toString())))
      .actionReindexMap2RawData('nameid')
      .actionWrite(outputFolder, fields)
      .onFinish(() => resolve(list))
      .onError(() => reject(list))
  );
};

export const minimizePlayernames = async (fifa: Fifa, inputFolder: string, outputFolder: string) => {
  const config: FifaConfig = fifaConfigFactory(fifa);
  const map = await writePlayernames(Table.PlayerNames, config.playernames, inputFolder, outputFolder);
  console.log('Map created', map.length);
  await writePlayers(Table.Players, config.players, map, inputFolder, outputFolder);
};
