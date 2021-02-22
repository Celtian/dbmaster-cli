import { WriteStream } from 'fs';
import { PassThrough } from 'stream';
import { Field, RawData, Table } from '../interfaces';

export type StreamBuilderType = NodeJS.ReadWriteStream | WriteStream | PassThrough;

export enum OutputFormat {
  Csv = 'csv',
  Json = 'json'
}

export enum ActionType {
  ActionAppendDefault = 'append-default',
  ActionExtendContract = 'extend-contract',
  ActionValidate = 'validate',
  ActionFilter = 'filter',
  ActionOnData = 'on-data'
}

export interface ActionFactoryAction {
  type: ActionType;
  filterFn?: (data: RawData) => boolean;
  onDataFn?: (data: RawData) => any;
}

export interface ActionFactorySource {
  folder: string;
  fields: Field[];
  format?: OutputFormat;
}

export interface ActionFactoryOptions {
  table: Table;
  input: ActionFactorySource;
  actions: ActionFactoryAction[];
  output?: ActionFactorySource;
}
