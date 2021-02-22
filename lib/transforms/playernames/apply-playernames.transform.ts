import { Transform, TransformCallback, TransformOptions } from 'stream';
import { IndexedRawData, RawData } from '../../interfaces';
import { bufferToData, dataToString } from '../../utils';

export interface ApplyPlayernamesTransformOptions extends TransformOptions {
  reindexMap: IndexedRawData[];
  foreingKeyPrimaryColumn: string;
  foreignKeyColumns: string[];
}

// only works with the table players
export class ApplyPlayernamesTransform extends Transform {
  private opts: ApplyPlayernamesTransformOptions;

  constructor(opts: ApplyPlayernamesTransformOptions) {
    super(opts);
    this.opts = opts;
  }

  public _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
    let object = bufferToData<RawData>(chunk);

    for (const col of this.opts.foreignKeyColumns) {
      object = {
        ...object,
        [col]: this.opts.reindexMap.find((i) => i.value[this.opts.foreingKeyPrimaryColumn] === object[col]).key
      };
    }

    this.push(dataToString<RawData>(object));
    callback();
  }

  public _flush(callback: TransformCallback): void {
    callback();
  }
}