import { createWriteStream, mkdirSync } from 'fs';
import { decodeStream, encodeStream } from 'iconv-lite';
import { join } from 'path';
import { PassThrough } from 'stream';
import { Field, Table } from '../interfaces';
import { Json2CsvTransform } from '../transforms/csv';
import { NewLineTransform } from '../transforms/line';
import { OutputFormat, StreamBuilderType } from './interfaces';

export class WriteStreamBuilder {
  private stream: StreamBuilderType;

  constructor(private table: Table) {
    this.init();
  }

  private init(): void {
    this.stream = new PassThrough();
  }

  public write(buffer: string): WriteStreamBuilder {
    this.stream.write(buffer);
    this.stream.emit('data', buffer);
    return this;
  }

  public close(): WriteStreamBuilder {
    this.stream.end();
    // this.stream.emit('finish');
    return this;
  }

  public actionOnData<T>(onDataFn: (data: T) => void): WriteStreamBuilder {
    this.stream = this.stream.on('data', (buffer: Buffer) => {
      const cur: T = JSON.parse(buffer.toString());
      onDataFn(cur);
    });
    return this;
  }

  public actionWrite(
    outputFolder: string,
    fields: Field[],
    format: OutputFormat = OutputFormat.Csv
  ): WriteStreamBuilder {
    mkdirSync(outputFolder, { recursive: true });
    const outputFile = join(outputFolder, `${this.table}.txt`);
    const ws = createWriteStream(outputFile);

    if (format === OutputFormat.Csv) {
      this.stream = this.stream.pipe(new Json2CsvTransform({ fields }));
    }

    this.stream = this.stream
      .pipe(new NewLineTransform())
      .pipe(decodeStream('utf-8'))
      .pipe(
        encodeStream('utf-16', {
          addBOM: true,
          defaultEncoding: 'utf16le'
        })
      )
      .pipe(ws);
    return this;
  }

  public onFinish(fn: () => void): WriteStreamBuilder {
    this.stream = this.stream.on('finish', fn);
    return this;
  }

  public onError(fn: () => void): WriteStreamBuilder {
    this.stream = this.stream.on('error', fn);
    return this;
  }

  public onPipe(): WriteStreamBuilder {
    this.stream = this.stream.on('pipe', (source) => {
      source.unpipe(this.stream);
      source.pipe(new NewLineTransform()).pipe(new NewLineTransform());
    });
    return this;
  }
}
