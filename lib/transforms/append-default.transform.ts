import { Transform, TransformCallback, TransformOptions } from 'stream';
import { Field, RawData } from '../interfaces';
import { ValidationBuilder } from '../utils';

export interface AppentDefaultTransformOptions extends TransformOptions {
  fields: Field[];
}

export class AppendDefaultTransform extends Transform {
  private opts: AppentDefaultTransformOptions;
  private vb: ValidationBuilder;

  constructor(opts?: AppentDefaultTransformOptions) {
    super(opts);
    this.opts = opts;
    this.vb = new ValidationBuilder(this.opts.fields);
  }

  public _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
    const object: RawData = JSON.parse(chunk.toString());
    for (const field of this.opts.fields) {
      const value = object[field.name];
      const { error } = this.vb.validationFn(field).validate(value);
      if (error) {
        object[field.name] = field.default;
      }
    }
    this.push(JSON.stringify(object));
    callback();
  }

  public _flush(callback: TransformCallback): void {
    callback();
  }
}
