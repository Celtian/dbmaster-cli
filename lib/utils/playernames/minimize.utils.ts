import { ReadWriteStreamBuilder } from '../../actions';
import { FifaConfig, fifaConfigFactory } from '../../fifa-config';
import { Field, Fifa, IndexedRawData, RawData, Table } from '../../interfaces';
import { MinimizePlayernamesStats, PLAYERNAMES_PRIMARY_COLUMN } from './interfaces';

const writePlayers = async (
  table: Table,
  fields: Field[],
  reindexMap: IndexedRawData[],
  inputFolder: string,
  outputFolder: string
): Promise<void> => {
  return new Promise(async (resolve, reject) =>
    new ReadWriteStreamBuilder(inputFolder, table, fields)
      .actionApplyPlayernames(reindexMap)
      .actionWrite(outputFolder, fields)
      .onFinish(() => resolve())
      .onError(() => reject())
  );
};

const writePlayernames = async (
  table: Table,
  fields: Field[],
  inputFolder: string,
  outputFolder: string
): Promise<MinimizePlayernamesStats> => {
  const range = fields.find((f) => f.name === PLAYERNAMES_PRIMARY_COLUMN).range;
  const reindexMap: IndexedRawData[] = [];
  let minBefore = range.max;
  let maxBefore = range.min;
  let minAfter = minBefore;
  let maxAfter = maxBefore;
  return new Promise(async (resolve, reject) =>
    new ReadWriteStreamBuilder(inputFolder, table, fields)
      .actionOnData<RawData>((data) => {
        const id: number = data[PLAYERNAMES_PRIMARY_COLUMN] as number;
        minBefore = id < minBefore ? id : minBefore;
        maxBefore = id > maxBefore ? id : maxBefore;
      })
      .actionReindex(range.min)
      .actionOnData<IndexedRawData>((data) => reindexMap.push(data))
      .actionIndexed2Raw(PLAYERNAMES_PRIMARY_COLUMN)
      .actionOnData<RawData>((data) => {
        const id: number = data[PLAYERNAMES_PRIMARY_COLUMN] as number;
        minAfter = id < minAfter ? id : minAfter;
        maxAfter = id > maxAfter ? id : maxAfter;
      })
      .actionWrite(outputFolder, fields)
      .onFinish(() => resolve({ reindexMap, minBefore, maxBefore, minAfter, maxAfter }))
      .onError(() => reject({ reindexMap, minBefore, maxBefore, minAfter, maxAfter }))
  );
};

/**
 * @description remove holes in tables 'playernames' and 'dcplayernames'
 */
export const minimizePlayernames = async (fifa: Fifa, inputFolder: string, outputFolder: string): Promise<void> => {
  const config: FifaConfig = fifaConfigFactory(fifa);
  const playernamesStats = await writePlayernames(Table.PlayerNames, config.playernames, inputFolder, outputFolder);
  const dcplayernamesStats = await writePlayernames(
    Table.DcPlayerNames,
    config.dcplayernames,
    inputFolder,
    outputFolder
  );

  await writePlayers(
    Table.Players,
    config.players,
    [...playernamesStats.reindexMap, ...dcplayernamesStats.reindexMap],
    inputFolder,
    outputFolder
  );

  console.table({
    playernames: {
      before: { min: playernamesStats.minBefore, max: playernamesStats.maxBefore },
      after: { min: playernamesStats.minAfter, max: playernamesStats.maxAfter }
    },
    dcplayernames: {
      before: { min: dcplayernamesStats.minBefore, max: dcplayernamesStats.maxBefore },
      after: { min: dcplayernamesStats.minAfter, max: dcplayernamesStats.maxAfter }
    }
  });
};
