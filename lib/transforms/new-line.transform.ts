import { Transform, TransformCallback, TransformOptions } from 'stream';

export class NewLineTransform extends Transform {
  constructor(opts?: TransformOptions) {
    super(opts);
  }

  public _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
    this.push(`${chunk.toString()}\r\n`);
    callback();
  }

  public _flush(callback: TransformCallback): void {
    callback();
  }
}
