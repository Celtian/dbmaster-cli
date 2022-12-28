import * as Joi from 'joi';
import { Transform, TransformCallback, TransformOptions } from 'stream';
import { ValidationBuilder } from '../fifa-config';
import { Field, RawData } from '../interfaces';

export interface ValidateTransformOptions extends TransformOptions {
  fields: Field[];
}

export class ValidateTransform extends Transform {
  private opts: ValidateTransformOptions;
  private schema: Joi.ObjectSchema<any>;

  constructor(opts?: ValidateTransformOptions) {
    super(opts);
    this.opts = opts;
    this.schema = new ValidationBuilder(this.opts.fields).schema();
  }

  public _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
    const data: RawData = JSON.parse(chunk.toString());
    const validated = this.schema.validate(data);
    if (validated.error || validated.warning) {
      this.push(JSON.stringify(validated));
    }
    callback();
  }

  public _flush(callback: TransformCallback): void {
    callback();
  }
}
