import { readFileSync } from 'fs';
import * as Joi from 'joi';
import { safeLoad } from 'js-yaml';
import { join } from 'path';
import { Fifa } from '../interfaces';

enum ConfigFile {
  Person = 'person'
}

const schema = Joi.object();

const readConfig = (fifa: Fifa, configFile: ConfigFile): any => {
  let json: string | object;
  try {
    const yaml = readFileSync(join(__dirname, fifa, `${configFile}.yml`)).toString();
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

export const configGeneratedFactory = (fifa: Fifa): ConfigGenerated => {
  const config = new ConfigGenerated();
  config.person = readConfig(fifa, ConfigFile.Person);
  return config;
};

export class ConfigGenerated {
  public person: any;
}
