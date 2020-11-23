import { Transform, TransformCallback, TransformOptions } from 'stream';
import { RawData } from '../interfaces';
import { ReindexMap } from '../utils';

export interface ReindexMap2RawDataTransformOptions extends TransformOptions {
  primaryColumn: string;
}

export class ReindexMap2RawDataTransform extends Transform {
  private opts: ReindexMap2RawDataTransformOptions;

  constructor(opts: ReindexMap2RawDataTransformOptions) {
    super(opts);
    this.opts = opts;
  }

  public _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
    const map: ReindexMap = JSON.parse(chunk.toString());
    const object: RawData = {
      ...map.value,
      [this.opts.primaryColumn]: map.key
    };
    this.push(JSON.stringify(object));
    callback();
  }

  public _flush(callback: TransformCallback): void {
    callback();
  }
}
