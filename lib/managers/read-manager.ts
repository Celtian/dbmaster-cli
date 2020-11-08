import { LineStream } from 'byline';
import { createReadStream, ReadStream } from 'fs';
import { decodeStream } from 'iconv-lite';
import { join } from 'path';
import { Config } from '../config';
import { Table } from '../interfaces';
import { Csv2JsonTransform } from '../transforms';

export class ReadManager {
  constructor(private config: Config) {}

  public createStream(inputFolder: string, table: Table): ReadStream {
    const inputFile = join(inputFolder, `${table}.txt`);
    return createReadStream(inputFile);
  }

  public readTable(inputFolder: string, table: Table): Promise<any[]> {
    const stream = this.createStream(inputFolder, table);
    const list: any[] = [];
    return new Promise(async (resolve, reject) =>
      stream
        .pipe(decodeStream('utf16le'))
        .pipe(new LineStream({ keepEmptyLines: false }))
        .pipe(new Csv2JsonTransform({ skip: 1, fields: this.config[table] }))
        .on('data', (buffer: Buffer) => {
          list.push(JSON.parse(buffer.toString()));
        })
        .on('finish', () => {
          resolve(list);
        })
        .on('error', () => {
          reject(list);
        })
    );
  }
}
