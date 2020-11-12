import { LineStream } from 'byline';
import { createReadStream, createWriteStream, mkdirSync, WriteStream } from 'fs';
import { decodeStream } from 'iconv-lite';
import { join } from 'path';
import { Field, RawData, Table } from '../interfaces';
import {
  AppendDefaultTransform,
  Csv2JsonTransform,
  FilterTransform,
  Json2CsvTransform,
  NewLineTransform,
  SkipTransform,
  ValidateTransform
} from '../transforms';

export type StreamBuilderType = NodeJS.ReadWriteStream | WriteStream;

export class StreamBuilder {
  private stream: StreamBuilderType;

  constructor(private inputFolder: string, private table: Table, private fields: Field[]) {
    this.stream = this.init(this.inputFolder, this.table, this.fields);
  }

  private init(inputFolder: string, table: Table, fields: Field[]): StreamBuilderType {
    const inputFile = join(inputFolder, `${table}.txt`);
    return createReadStream(inputFile)
      .pipe(decodeStream('utf16le'))
      .pipe(new LineStream({ keepEmptyLines: false }))
      .pipe(new SkipTransform({ skip: 1 }))
      .pipe(new Csv2JsonTransform({ fields }));
  }

  public actionValidate(fields: Field[]): StreamBuilder {
    this.stream = this.stream.pipe(new ValidateTransform({ fields }));
    return this;
  }

  public actionFilter(filterFn: (data: RawData) => boolean): StreamBuilder {
    this.stream = this.stream.pipe(new FilterTransform({ filterFn }));
    return this;
  }

  public actionAppendDefault(fields: Field[]): StreamBuilder {
    this.stream = this.stream.pipe(new AppendDefaultTransform({ fields }));
    return this;
  }

  public actionWrite(outputFolder: string, fields: Field[]): StreamBuilder {
    mkdirSync(outputFolder, { recursive: true });
    const outputFile = join(outputFolder, `${this.table}.txt`);
    const ws = createWriteStream(outputFile, { encoding: 'utf16le' });

    this.stream = this.stream.pipe(new Json2CsvTransform({ fields })).pipe(new NewLineTransform()).pipe(ws);

    return this;
  }

  public onData(fn: (buffer: Buffer) => void): StreamBuilder {
    this.stream = this.stream.on('data', fn);
    return this;
  }

  public onFinish(fn: () => void): StreamBuilder {
    this.stream = this.stream.on('finish', fn);
    return this;
  }

  public onError(fn: () => void): StreamBuilder {
    this.stream = this.stream.on('error', fn);
    return this;
  }
}
