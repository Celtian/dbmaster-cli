import { Transform, TransformCallback, TransformOptions } from 'stream';
import { Field, IndexedRawData, RawData } from '../../interfaces';
import { bufferToData, dataToString } from '../../utils';

export interface Raw2IndexedTransformOptions extends TransformOptions {
  fields: Field[];
}

export class Raw2IndexedTransform extends Transform {
  private opts: Raw2IndexedTransformOptions;

  constructor(opts?: Raw2IndexedTransformOptions) {
    super(opts);
    this.opts = opts;
  }

  public _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
    const value = bufferToData<RawData>(chunk);
    const unique = this.opts.fields.find((f) => f.unique);
    if (unique) {
      const key = value[unique.name] as number;
      this.push(
        dataToString<IndexedRawData>({ key, value })
      );
    }
    callback();
  }

  public _flush(callback: TransformCallback): void {
    callback();
  }
}
