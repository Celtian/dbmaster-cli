import { Transform, TransformCallback, TransformOptions } from 'stream';
import { Datatype, Field, RawData } from '../../interfaces';
import { dataToString, sortByOrder } from '../../utils';

export interface Csv2JsonTransformOptions extends TransformOptions {
  fields: Field[];
}

export class Csv2JsonTransform extends Transform {
  private opts: Csv2JsonTransformOptions;

  constructor(opts?: Csv2JsonTransformOptions) {
    super(opts);
    this.opts = opts;
  }

  public _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
    const cols = chunk.toString().split(/\t/);
    const { length } = cols;

    if (length === this.opts.fields.length) {
      const object: RawData = this.opts.fields
        .sort(sortByOrder)
        .reduce((acc, field) => ({ ...acc, [field.name]: this.formatFn(field, cols[field.order]) }), {});

      this.push(dataToString<RawData>(object));
    }
    callback();
  }

  public _flush(callback: TransformCallback): void {
    callback();
  }

  private formatFn(field: Field, value: string): string | number {
    switch (field.type) {
      case Datatype.Int:
        return Number(value);
      case Datatype.Float:
        return Number(value.replace(',', '.'));
      default:
        return value;
    }
  }
}
