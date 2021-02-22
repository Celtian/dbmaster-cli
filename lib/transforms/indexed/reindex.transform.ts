import { Transform, TransformCallback, TransformOptions } from 'stream';
import { IndexedRawData, RawData } from '../../interfaces';
import { bufferToData, dataToString } from '../../utils';

export interface ReindexTransformOptions extends TransformOptions {
  startingPos: number;
}

export class ReindexTransform extends Transform {
  private opts: ReindexTransformOptions;
  private currentPos = 0;

  constructor(opts?: ReindexTransformOptions) {
    super(opts);
    this.opts = opts;
    this.initStartingPosition();
  }

  public _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
    const value = bufferToData<RawData>(chunk);
    this.push(
      dataToString<IndexedRawData>({ key: this.currentPos, value })
    );
    this.currentPos++;
    callback();
  }

  public _flush(callback: TransformCallback): void {
    this.initStartingPosition();
    callback();
  }

  private initStartingPosition(): void {
    this.currentPos = this.opts && this.opts.startingPos ? this.opts.startingPos : 0;
  }
}
