import { StreamBuilder } from '../actions';
import { Field, RawData, Table } from '../interfaces';

export interface ReindexMap {
  key: number;
  value: RawData;
}

export const reindexMap = async (inputFolder: string, table: Table, fields: Field[]): Promise<ReindexMap[]> => {
  const list: ReindexMap[] = [];
  return new Promise(async (resolve, reject) =>
    new StreamBuilder(inputFolder, table, fields)
      .actionReindex(0)
      .actionOnData((data: any) => list.push(data))
      .onFinish(() => resolve(list))
      .onError(() => reject(list))
  );
};
