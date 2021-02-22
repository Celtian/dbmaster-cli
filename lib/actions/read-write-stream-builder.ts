import { LineStream } from 'byline';
import { createReadStream, createWriteStream, mkdirSync } from 'fs';
import { decodeStream, encodeStream } from 'iconv-lite';
import { join } from 'path';
import { Field, IndexedRawData, RawData, Table } from '../interfaces';
import { Csv2JsonTransform, Json2CsvTransform } from '../transforms/csv';
import { Indexed2RawTransform, Raw2IndexedTransform, ReindexTransform } from '../transforms/indexed';
import { NewLineTransform, SkipTransform } from '../transforms/line';
import {
  AppendDefaultTransform,
  ExtendContractTransform,
  FilterTransform,
  ValidateTransform
} from '../transforms/other';
import { ApplyPlayernamesTransform, PlayernamesCountryRulesTransform } from '../transforms/playernames';
import { PLAYERNAMES_PRIMARY_COLUMN, playersPlayernamesColumns } from '../utils/playernames';
import { OutputFormat, StreamBuilderType } from './interfaces';

export class ReadWriteStreamBuilder {
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

  public actionValidate(fields: Field[]): ReadWriteStreamBuilder {
    this.stream = this.stream.pipe(new ValidateTransform({ fields }));
    return this;
  }

  public actionFilter(filterFn: (data: RawData) => boolean): ReadWriteStreamBuilder {
    this.stream = this.stream.pipe(new FilterTransform({ filterFn }));
    return this;
  }

  public actionAppendDefault(fields: Field[]): ReadWriteStreamBuilder {
    this.stream = this.stream.pipe(new AppendDefaultTransform({ fields }));
    return this;
  }

  public actionExtendContract(fields: Field[], refDate?: Date): ReadWriteStreamBuilder {
    this.stream = this.stream.pipe(new ExtendContractTransform({ fields, refDate }));
    return this;
  }

  public actionReindex(startingPos: number = 0): ReadWriteStreamBuilder {
    this.stream = this.stream.pipe(new ReindexTransform({ startingPos }));
    return this;
  }

  public actionApplyPlayernames(
    reindexMap: IndexedRawData[],
    foreingKeyPrimaryColumn: string = PLAYERNAMES_PRIMARY_COLUMN,
    foreignKeyColumns: string[] = playersPlayernamesColumns
  ): ReadWriteStreamBuilder {
    this.stream = this.stream.pipe(
      new ApplyPlayernamesTransform({ reindexMap, foreingKeyPrimaryColumn, foreignKeyColumns })
    );
    return this;
  }

  public actionApplyCountryRulesToPlayers(
    fields: Field[],
    playernamesMap: Map<number, RawData>
  ): ReadWriteStreamBuilder {
    this.stream = this.stream.pipe(new PlayernamesCountryRulesTransform({ fields, playernamesMap }));
    return this;
  }

  public actionRaw2Indexed(fields: Field[]): ReadWriteStreamBuilder {
    this.stream = this.stream.pipe(new Raw2IndexedTransform({ fields }));
    return this;
  }

  public actionIndexed2Raw(primaryColumn: string): ReadWriteStreamBuilder {
    this.stream = this.stream.pipe(new Indexed2RawTransform({ primaryColumn }));
    return this;
  }

  public actionOnData<T>(onDataFn: (data: T) => void): ReadWriteStreamBuilder {
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
  ): ReadWriteStreamBuilder {
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

  public onFinish(fn: () => void): ReadWriteStreamBuilder {
    this.stream = this.stream.on('finish', fn);
    return this;
  }

  public onError(fn: () => void): ReadWriteStreamBuilder {
    this.stream = this.stream.on('error', fn);
    return this;
  }
}
