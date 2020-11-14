import { Transform, TransformCallback, TransformOptions } from 'stream';
import { ValidationBuilder } from '../fifa-config';
import { DateGenerator } from '../generators';
import { Field, RawData } from '../interfaces';

export interface ExtendContractTransformOptions extends TransformOptions {
  fields: Field[];
  refDate?: Date;
}

export class ExtendContractTransform extends Transform {
  private opts: ExtendContractTransformOptions;
  private vb: ValidationBuilder;
  private dg: DateGenerator;

  constructor(opts?: ExtendContractTransformOptions) {
    super(opts);
    this.opts = opts;
    this.vb = new ValidationBuilder(this.opts.fields);
    this.dg = new DateGenerator(this.opts.refDate);
  }

  public _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
    let object: RawData = JSON.parse(chunk.toString());

    object = this.updateField(
      object,
      'contractvaliduntil',
      (v) => v < this.opts.refDate.getFullYear(),
      () => this.dg.contractValidUntil()
    );

    object = this.updateField(
      object,
      'loandateend',
      (v) => v < this.opts.refDate.toFifaDate(),
      () => this.dg.loanDateEnd()
    );

    this.push(JSON.stringify(object));
    callback();
  }

  public _flush(callback: TransformCallback): void {
    callback();
  }

  private updateField(
    object: RawData,
    fieldName: string,
    condition: (value: number | string) => boolean,
    setValue: () => string | number
  ): RawData {
    const field = this.opts.fields.find((f) => f.name === fieldName);
    if (field) {
      const value = object[field.name];
      const { error } = this.vb.validationFn(field).validate(value);
      if (error || condition) {
        object[field.name] = setValue();
      }
    }
    return object;
  }
}
