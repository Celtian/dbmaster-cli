import { StreamBuilder } from '../actions';
import { FifaConfig, fifaConfigFactory } from '../fifa-config';
import { Field, Fifa, PLAYERNAMES_PRIMARY_COLUMN, playersPlayernamesColumns, Table } from '../interfaces';

const usedUniquePlayernameIds = async (inputFolder: string, table: Table, fields: Field[]): Promise<Set<number>> => {
  const list = new Set<number>();
  let totalCount = 0;
  return new Promise(async (resolve, reject) =>
    new StreamBuilder(inputFolder, table, fields)
      .actionOnData((data: any) => {
        for (const col of playersPlayernamesColumns) {
          list.add(data[col] as number);
        }
        totalCount++;
      })
      .onFinish(() => resolve(list))
      .onError(() => reject(list))
  );
};

const writePlayernames = async (
  table: Table,
  fields: Field[],
  inputFolder: string,
  outputFolder: string,
  uniqueIds: Set<number>
): Promise<{ before: number; after: number }> => {
  let before = 0;
  let after = 0;
  return new Promise(async (resolve, reject) =>
    new StreamBuilder(inputFolder, table, fields)
      .onData(() => before++)
      .actionFilter((x) => uniqueIds.has(x[PLAYERNAMES_PRIMARY_COLUMN] as number))
      .onData(() => after++)
      .actionWrite(outputFolder, fields)
      .onFinish(() => resolve({ before, after }))
      .onError(() => reject({ before, after }))
  );
};

/**
 * @description remove unused values from tables 'playernames' and 'dcplayernames'
 */
export const removeUnusedPlayernames = async (fifa: Fifa, inputFolder: string, outputFolder: string): Promise<void> => {
  const config: FifaConfig = fifaConfigFactory(fifa);
  const usedIds = await usedUniquePlayernameIds(inputFolder, Table.Players, config.players);
  const playernames = await writePlayernames(Table.PlayerNames, config.playernames, inputFolder, outputFolder, usedIds);
  const dcplayernames = await writePlayernames(
    Table.DcPlayerNames,
    config.dcplayernames,
    inputFolder,
    outputFolder,
    usedIds
  );
  console.table({
    playernames,
    dcplayernames,
    all: { before: playernames.before + dcplayernames.before, after: usedIds.size }
  });
};
