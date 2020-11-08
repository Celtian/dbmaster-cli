import { LineStream } from 'byline';
import { createReadStream, createWriteStream, mkdirSync } from 'fs';
import { decodeStream } from 'iconv-lite';
import { dirname, join } from 'path';
import { Stream } from 'stream';
import { Config, configFactory } from '../config';
import { Field, Fifa, Table } from '../interfaces';
import { AppendDefaultTransform, Csv2JsonTransform, Json2CsvTransform, NewLineTransform } from '../transforms';

export class ConvertManager {
  private configFrom: Config;
  private configTo: Config;

  constructor(convertFrom: Fifa, convertTo: Fifa) {
    this.configFrom = configFactory(convertFrom);
    this.configTo = configFactory(convertTo);
  }

  public async convertTable(table: Table, inputFolder: string, outputFolder: string): Promise<any[]> {
    const inputFile = join(inputFolder, `${table}.txt`);
    const outputFile = join(outputFolder, `${table}.txt`);
    const stream = createReadStream(inputFile);
    return await this.readTransformAndWriteStream(stream, table, outputFile);
  }

  private readTransformAndWriteStream(stream: Stream, table: Table, output: string): Promise<any[]> {
    const fromfields: Field[] = this.configFrom[table];
    const tofields: Field[] = this.configTo[table];
    const list: any[] = [];

    mkdirSync(dirname(output), { recursive: true });

    const writeStream = createWriteStream(output, { encoding: 'utf16le' });

    return new Promise(async (resolve, reject) =>
      stream
        .pipe(decodeStream('utf16le'))
        .pipe(new LineStream({ keepEmptyLines: false }))
        .pipe(new Csv2JsonTransform({ skip: 1, fields: fromfields }))
        .pipe(new AppendDefaultTransform({ fields: tofields }))
        .on('data', (buffer: Buffer) => {
          list.push(JSON.parse(buffer.toString()));
        })
        .pipe(new Json2CsvTransform({ fields: tofields }))
        .pipe(new NewLineTransform())
        .pipe(writeStream)
        .on('finish', () => {
          resolve(list);
        })
        .on('error', () => {
          reject(list);
        })
    );
  }
}
