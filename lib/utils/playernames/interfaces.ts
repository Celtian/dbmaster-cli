import { IndexedRawData } from '../../interfaces';

export enum PlayersPlayernamesColumn {
  FirstNameId = 'firstnameid',
  LastNameId = 'lastnameid',
  CommonNameId = 'commonnameid',
  PlayerJerseyNameId = 'playerjerseynameid'
}

export const playersPlayernamesColumns = Object.values(PlayersPlayernamesColumn);

export const PLAYERNAMES_PRIMARY_COLUMN = 'nameid';
export const PLAYERNAMES_STRING_COLUMN = 'name';
export const PLAYERNAMES_NATIONALITY_COLUMN = 'nationality';

export enum PlayernamesCountry {
  Brazil = 54,
  KoreaDPR = 166,
  KoreaRepublic = 167,
  Portugal = 38,
  SaudiArabia = 183,
  Spain = 45
}

export interface PlayerPlayernames {
  commonName: string;
  firstName: string;
  jerseyName: string;
  lastName: string;
}

export interface MinimizePlayernamesStats {
  reindexMap: IndexedRawData[];
  minBefore: number;
  maxBefore: number;
  minAfter: number;
  maxAfter: number;
}

export interface RemoveUnusedStats {
  before: number;
  after: number;
}
