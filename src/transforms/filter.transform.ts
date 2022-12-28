import { Transform, TransformCallback, TransformOptions } from 'stream';
import { RawData } from '../interfaces';

export interface FilterTransformOptions extends TransformOptions {
  filterFn: (data: RawData) => boolean;
}

export class FilterTransform extends Transform {
  private opts: FilterTransformOptions;

  constructor(opts?: FilterTransformOptions) {
    super(opts);
    this.opts = opts;
  }

  public _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
    const object: RawData = JSON.parse(chunk.toString());

    if (this.opts.filterFn(object)) {
      this.push(chunk);
      callback();
      return;
    }

    callback();
  }

  public _flush(callback: TransformCallback): void {
    callback();
  }
}
