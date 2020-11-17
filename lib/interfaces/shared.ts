export enum Fifa {
  Fifa11 = 'fifa11',
  Fifa12 = 'fifa12',
  Fifa13 = 'fifa13',
  Fifa14 = 'fifa14',
  Fifa15 = 'fifa15',
  Fifa16 = 'fifa16',
  Fifa17 = 'fifa17',
  Fifa18 = 'fifa18',
  Fifa19 = 'fifa19',
  Fifa20 = 'fifa20',
  Fifa21 = 'fifa21'
}

export enum Table {
  Competition = 'competition',
  Formations = 'formations',
  LeagueRefereeLinks = 'leaguerefereelinks',
  Leagues = 'leagues',
  LeagueTeamLinks = 'leagueteamlinks',
  Manager = 'manager',
  Nations = 'nations',
  PlayerBoots = 'playerboots',
  PlayerGrudgelove = 'player_grudgelove',
  PlayerLoans = 'playerloans',
  PlayerNames = 'playernames',
  Players = 'players',
  PreviousTeam = 'previousteam',
  Referee = 'referee',
  Rivals = 'rivals',
  RowTeamNationLinks = 'rowteamnationlinks',
  ShoeColors = 'shoecolors',
  Stadiums = 'stadiums',
  TeamBalls = 'teamballs',
  TeamKits = 'teamkits',
  TeamNationLinks = 'teamnationlinks',
  TeamPlayerLinks = 'teamplayerlinks',
  Teams = 'teams',
  TeamStadiumLinks = 'teamstadiumlinks'
}

export enum Datatype {
  Int = 'int',
  String = 'string',
  Float = 'float'
}

export interface Range {
  min: number;
  max: number;
}

export interface Field {
  name: string;
  order: number;
  type: Datatype;
  default: any;
  range?: Range;
}

export type KeyValueFrequency = { [key: string]: string };

export type RawData = { [key: string]: string | number };
