import { Transform, TransformCallback, TransformOptions } from 'stream';
import { Datatype, Field } from '../interfaces';

export interface Csv2JsonTransformOptions extends TransformOptions {
  skip?: number;
  fields: Field[];
}

export class Csv2JsonTransform extends Transform {
  private line = 0;
  private opts: Csv2JsonTransformOptions;

  constructor(opts?: Csv2JsonTransformOptions) {
    super(opts);
    this.opts = opts;
  }

  public _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
    if (this.opts.skip && this.line < this.opts.skip) {
      this.line++;
      callback();
      return;
    }
    const cols = chunk.toString().split(/\t/);
    const { length } = cols;

    if (length === this.opts.fields.length) {
      const json: any = new Object();
      for (const field of this.opts.fields.sort((a, b) => a.order - b.order)) {
        switch (field.type) {
          case Datatype.Int:
            json[field.name] = Number(cols[field.order]);
            break;
          case Datatype.Float:
            json[field.name] = Number(cols[field.order].replace(',', '.'));
            break;
          default:
            json[field.name] = cols[field.order];
            break;
        }
      }
      this.push(JSON.stringify(json));
    }
    this.line++;
    callback();
  }

  public _flush(callback: TransformCallback): void {
    this.line = 0;
    callback();
  }
}
