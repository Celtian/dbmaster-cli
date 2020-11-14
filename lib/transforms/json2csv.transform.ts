import { Transform, TransformCallback, TransformOptions } from 'stream';
import { Field } from '../interfaces';
import { sortByOrder } from '../utils';

export interface Json2CsvTransformOptions extends TransformOptions {
  fields: Field[];
}

export class Json2CsvTransform extends Transform {
  private opts: Json2CsvTransformOptions;
  private line = 0;

  constructor(opts?: Json2CsvTransformOptions) {
    super(opts);
    this.opts = opts;
  }

  public _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
    const lines: string[] = [];
    const orderedFields = this.opts.fields.sort(sortByOrder);
    if (this.line === 0) {
      lines.push(orderedFields.map((f) => f.name).join('\t'));
    }
    const oldValue = JSON.parse(chunk.toString());
    lines.push(orderedFields.map((f) => oldValue[f.name]).join('\t'));

    this.push(lines.join('\r\n'));

    this.line++;
    callback();
  }

  public _flush(callback: TransformCallback): void {
    this.line = 0;
    callback();
  }
}
