import { ReadWriteStreamBuilder } from '../actions';
import { FifaConfig, fifaConfigFactory } from '../fifa-config';
import { Field, Fifa, IndexedRawData, RawData, Table } from '../interfaces';
import { PLAYERNAMES_STRING_COLUMN } from './playernames/interfaces';

export const freeId = (map: Map<number, RawData>, minId: number = 0): number => {
  const stats = Array.from(map)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => a.key - b.key)
    .reduce(
      (accumulator, currentValue) => {
        if (
          accumulator.firstFree === undefined &&
          accumulator.last !== undefined &&
          currentValue.key - accumulator.last > 1
        ) {
          accumulator.firstFree = accumulator.last + 1;
        }
        accumulator.last = currentValue.key;
        return accumulator;
      },
      { last: undefined, firstFree: undefined }
    );
  return stats.firstFree || stats.last + 1 || minId;
};

export const indexedMap = async (inputFolder: string, table: Table, fields: Field[]): Promise<Map<number, RawData>> => {
  const map = new Map<number, RawData>();
  return new Promise(async (resolve, reject) =>
    new ReadWriteStreamBuilder(inputFolder, table, fields)
      .actionRaw2Indexed(fields)
      .actionOnData<IndexedRawData>((data: IndexedRawData): void => {
        map.set(data.key, data.value);
      })
      .onFinish(() => resolve(map))
      .onError(() => reject(map))
  );
};

export const createPlayernamesMap = async (fifa: Fifa, inputFolder: string): Promise<Map<number, RawData>> => {
  const config: FifaConfig = fifaConfigFactory(fifa);
  const mapPlayerNames = await indexedMap(inputFolder, Table.PlayerNames, config.playernames);
  const mapDcPlayernames = await indexedMap(inputFolder, Table.DcPlayerNames, config.dcplayernames);
  return new Map([...mapDcPlayernames, ...mapPlayerNames]);
};

export const findPlayernameByString = (name: string, map: Map<number, RawData>): IndexedRawData[] => {
  return Array.from(map)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => a.key - b.key)
    .filter((data) => data.value[PLAYERNAMES_STRING_COLUMN] === name);
};

export const getOrCreatePlayername = (name: string, map: Map<number, RawData>, minId: number = 0): number => {
  const arr = findPlayernameByString(name, map);
  if (arr.length === 1) {
    return arr[0].key;
  } else {
    const nameId = freeId(map, minId);
    map.set(nameId, { name, nameId });
    return nameId;
  }
};
