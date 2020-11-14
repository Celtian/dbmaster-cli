import * as Joi from 'joi';
import { Datatype, Field } from '../interfaces';

export class ValidationBuilder {
  constructor(private fields: Field[]) {}

  public schema(): Joi.ObjectSchema<any> {
    return Joi.object(
      this.fields
        .map((field) => ({
          name: field.name,
          validationFn: this.validationFn(field)
        }))
        .reduce(
          (obj, cur) => ({
            ...obj,
            [cur.name]: cur.validationFn
          }),
          {}
        )
    );
  }

  public validationFn(field: Field): Joi.NumberSchema | Joi.StringSchema {
    switch (field.type) {
      case Datatype.Int:
        return Joi.number().integer().required().min(field.range.min).max(field.range.max);
      case Datatype.Float:
        return Joi.number().required();
      default:
        return Joi.string().required().allow('');
    }
  }
}
