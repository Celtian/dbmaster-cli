import { Transform, TransformCallback, TransformOptions } from 'stream';
import { ReindexMap } from '../utils';

export interface ApplyPlayernamesTransformOptions extends TransformOptions {
  reindexMap: ReindexMap[];
  foreingKeyPrimaryColumn: string; // nameid
  foreignKeyColumns: string[]; // firstnameid, lastnameid, commonnameid, playerjerseynameid
}

// only works with the table players
export class ApplyPlayernamesTransform extends Transform {
  private opts: ApplyPlayernamesTransformOptions;

  constructor(opts: ApplyPlayernamesTransformOptions) {
    super(opts);
    this.opts = opts;
  }

  public _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
    let object = JSON.parse(chunk.toString());

    for (const col of this.opts.foreignKeyColumns) {
      object = {
        ...object,
        [col]: this.opts.reindexMap.find((i) => i.value[this.opts.foreingKeyPrimaryColumn] === object[col]).key
      };
    }

    this.push(JSON.stringify(object));
    callback();
  }

  public _flush(callback: TransformCallback): void {
    callback();
  }
}
