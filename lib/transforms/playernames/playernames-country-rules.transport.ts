import { Transform, TransformCallback, TransformOptions } from 'stream';
import { Field, RawData } from '../../interfaces';
import { bufferToData, dataToString, getOrCreatePlayername } from '../../utils';
import { applyCountryRules } from '../../utils/playernames';
import {
  PLAYERNAMES_NATIONALITY_COLUMN,
  PLAYERNAMES_STRING_COLUMN,
  PlayersPlayernamesColumn
} from '../../utils/playernames/interfaces';

export interface PlayernamesCountryRulesTransformOptions extends TransformOptions {
  fields: Field[];
  playernamesMap: Map<number, RawData>;
}

export class PlayernamesCountryRulesTransform extends Transform {
  private opts: PlayernamesCountryRulesTransformOptions;

  constructor(opts: PlayernamesCountryRulesTransformOptions) {
    super(opts);
    this.opts = opts;
  }

  public _transform(chunk: Buffer, encoding: string, callback: TransformCallback): void {
    const object = bufferToData<RawData>(chunk);
    const nationality = Number(this.readField(object, PLAYERNAMES_NATIONALITY_COLUMN));
    let names = {
      commonName: String(
        this.opts.playernamesMap.get(Number(this.readField(object, PlayersPlayernamesColumn.CommonNameId)))[
          PLAYERNAMES_STRING_COLUMN
        ]
      ),
      firstName: String(
        this.opts.playernamesMap.get(Number(this.readField(object, PlayersPlayernamesColumn.FirstNameId)))[
          PLAYERNAMES_STRING_COLUMN
        ]
      ),
      jerseyName: String(
        this.opts.playernamesMap.get(Number(this.readField(object, PlayersPlayernamesColumn.PlayerJerseyNameId)))[
          PLAYERNAMES_STRING_COLUMN
        ]
      ),
      lastName: String(
        this.opts.playernamesMap.get(Number(this.readField(object, PlayersPlayernamesColumn.LastNameId)))[
          PLAYERNAMES_STRING_COLUMN
        ]
      )
    };
    names = applyCountryRules(nationality, names);
    object[PlayersPlayernamesColumn.CommonNameId] = getOrCreatePlayername(names.commonName, this.opts.playernamesMap);
    object[PlayersPlayernamesColumn.FirstNameId] = getOrCreatePlayername(names.firstName, this.opts.playernamesMap);
    object[PlayersPlayernamesColumn.LastNameId] = getOrCreatePlayername(names.lastName, this.opts.playernamesMap);
    object[PlayersPlayernamesColumn.PlayerJerseyNameId] = getOrCreatePlayername(
      names.jerseyName,
      this.opts.playernamesMap
    );
    this.push(dataToString<RawData>(object));
    callback();
  }

  public _flush(callback: TransformCallback): void {
    callback();
  }

  private readField(object: RawData, fieldName: string): string | number {
    const field = this.opts.fields.find((f) => f.name === fieldName);
    if (field) {
      return object[field.name];
    }
    return undefined;
  }
}
