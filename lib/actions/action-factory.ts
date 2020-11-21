import { existsSync } from 'fs';
import { join } from 'path';
import { Field, RawData } from '../interfaces';
import { ActionFactoryOptions, ActionType } from './interfaces';
import { StreamBuilder } from './stream-builder';

export const actionFactory = async (opts: ActionFactoryOptions): Promise<RawData[]> => {
  const list: RawData[] = [];
  return new Promise<RawData[]>(async (resolve, reject) => {
    const exists = existsSync(join(opts.input.folder, `${opts.table}.txt`));
    if (!exists) {
      resolve([]);
    } else {
      let str = new StreamBuilder(opts.input.folder, opts.table, opts.input.fields);

      let fields: Field[] = opts.input.fields;
      for (const action of opts.actions) {
        switch (action.type) {
          case ActionType.ActionFilter:
            str = str.actionFilter(action.filterFn);
            break;
          case ActionType.ActionValidate:
            str = str.actionValidate(fields);
            break;
          case ActionType.ActionExtendContract:
            str = str.actionExtendContract(fields);
            break;
          case ActionType.ActionAppendDefault:
            fields = opts.output ? opts.output.fields : opts.input.fields;
            str = str.actionAppendDefault(fields);
            break;
          case ActionType.ActionOnData:
            str = str.actionOnData(action.onDataFn);
            break;
          default:
            break;
        }
      }

      str = str.onData((buffer: Buffer) => list.push(JSON.parse(buffer.toString())));

      if (opts.output) {
        str = str.actionWrite(opts.output.folder, opts.output.fields, opts.output.format);
      }

      str = str.onFinish(() => resolve(list)).onError(() => reject(list));
    }
  });
};
