import { readFileSync } from 'fs';
import * as Joi from 'joi';
import { safeLoad } from 'js-yaml';
import { ActionType, OutputFormat } from '../actions';
import { Fifa } from '../interfaces';
import { Config } from './config';
import { ConfigFile } from './interfaces';

const schema = Joi.object({
  input: Joi.object({
    version: Joi.string()
      .required()
      .valid(...Object.values(Fifa)),
    folder: Joi.string().required()
  }).required(),
  actions: Joi.array()
    .min(1)
    .required()
    .items({
      type: Joi.string()
        .required()
        .valid(...Object.values(ActionType))
    }),
  output: Joi.object({
    version: Joi.string()
      .required()
      .valid(...Object.values(Fifa)),
    folder: Joi.string().required(),
    format: Joi.string().valid(...Object.values(OutputFormat))
  })
});

const readConfig = (path: string): ConfigFile => {
  let json: string | object;
  try {
    const yaml = readFileSync(path).toString();
    json = safeLoad(yaml);
  } catch (e) {
    throw new Error(e);
  }
  const { error, value } = schema.validate(json);
  if (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }
  return value;
};

export const configFactory = (path: string): Config => {
  const configFile = readConfig(path);
  return new Config(configFile);
};
