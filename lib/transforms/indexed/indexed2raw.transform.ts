import { Transform, TransformCallback, TransformOptions } from 'stream';
import { IndexedRawData, RawData } from '../../interfaces';
import { bufferToData, dataToString } from '../../utils';

export interface Indexed2RawTransformOptions extends TransformOptions {
  primaryColumn: string;
}

export class Indexed2RawTransform extends Transform {
  private opts: Indexed2RawTransformOptions;

  constructor(opts: Indexed2RawTransformOptions) {
    super(opts);
    this.opts = opts;
  }

  public _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
    const map = bufferToData<IndexedRawData>(chunk);
    this.push(
      dataToString<RawData>({ ...map.value, [this.opts.primaryColumn]: map.key })
    );
    callback();
  }

  public _flush(callback: TransformCallback): void {
    callback();
  }
}
