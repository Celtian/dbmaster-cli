import { Transform, TransformCallback, TransformOptions } from 'stream';
import { Datatype, Field } from '../interfaces';

export interface AppentDefaultTransformOptions extends TransformOptions {
  fields: Field[];
}

export class AppendDefaultTransform extends Transform {
  private opts: AppentDefaultTransformOptions;

  constructor(opts?: AppentDefaultTransformOptions) {
    super(opts);
    this.opts = opts;
  }

  public _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
    const oldObject = JSON.parse(chunk.toString());
    const newObject: any = new Object();
    for (const toField of this.opts.fields) {
      let oldValue = oldObject[toField.name];
      if (!!oldValue) {
        if (toField.type === Datatype.Int) {
          oldValue = Number(oldObject[toField.name]);
          if (oldValue >= toField.range.min && oldValue <= toField.range.max) {
            newObject[toField.name] = oldValue;
          } else {
            newObject[toField.name] = toField.default;
          }
        } else {
          newObject[toField.name] = oldValue;
        }
      } else {
        newObject[toField.name] = toField.default;
      }
    }
    this.push(JSON.stringify(newObject));
    callback();
  }

  public _flush(callback: TransformCallback): void {
    callback();
  }
}
