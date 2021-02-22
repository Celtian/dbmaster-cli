import { Transform, TransformCallback, TransformOptions } from 'stream';
import { ValidationBuilder } from '../../fifa-config';
import { Field, RawData } from '../../interfaces';
import { bufferToData, dataToString } from '../../utils';

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
    const object = bufferToData<RawData>(chunk);
    for (const field of this.opts.fields) {
      const value = object[field.name];
      const { error } = this.vb.validationFn(field).validate(value);
      if (error) {
        object[field.name] = field.default;
      }
    }
    this.push(dataToString<RawData>(object));
    callback();
  }

  public _flush(callback: TransformCallback): void {
    callback();
  }
}
