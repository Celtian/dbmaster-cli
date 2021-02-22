import { Transform, TransformCallback, TransformOptions } from 'stream';

export interface SkipTransformOptions extends TransformOptions {
  skip: number;
}

export class SkipTransform extends Transform {
  private line = 0;
  private opts: SkipTransformOptions;

  constructor(opts?: SkipTransformOptions) {
    super(opts);
    this.opts = opts;
  }

  public _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
    if (this.opts.skip && this.line < this.opts.skip) {
      this.line++;
      callback();
      return;
    }
    this.push(chunk);
    this.line++;
    callback();
  }

  public _flush(callback: TransformCallback): void {
    this.line = 0;
    callback();
  }
}
