import { readFileSync } from 'fs';
import * as Joi from 'joi';
import { safeLoad } from 'js-yaml';
import { join } from 'path';
import { Datatype, Field, Fifa, Table } from '../interfaces';
import { FifaConfig } from './fifa-config';

const schema = Joi.array()
  .unique((a, b) => a.order === b.order)
  .items({
    name: Joi.string().required(),
    order: Joi.number().min(0).integer().required(),
    type: Joi.string()
      .valid(...Object.values(Datatype))
      .required(),
    default: Joi.any().required(),
    range: Joi.object({
      min: Joi.number().integer().required(),
      max: Joi.number().integer().min(Joi.ref('min')).required()
    }).when('type', { is: 'int', then: Joi.required(), otherwise: Joi.optional() })
  });

const readConfig = (fifa: Fifa, table: Table): Field[] => {
  let json: string | object;
  try {
    const yaml = readFileSync(join(__dirname, fifa, `${table}.yml`)).toString();
    json = safeLoad(yaml);
  } catch (e) {
    throw new Error(e);
  }
  const { error, value } = schema.validate(json);
  if (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }
  return value || [];
};

export const fifaConfigFactory = (fifa: Fifa): FifaConfig => {
  const config = new FifaConfig();
  config.competition = readConfig(fifa, Table.Competition);
  config.formations = readConfig(fifa, Table.Formations);
  config.leaguerefereelinks = readConfig(fifa, Table.LeagueRefereeLinks);
  config.leagues = readConfig(fifa, Table.Leagues);
  config.leagueteamlinks = readConfig(fifa, Table.LeagueTeamLinks);
  config.manager = readConfig(fifa, Table.Manager);
  config.nations = readConfig(fifa, Table.Nations);
  config.player_grudgelove = readConfig(fifa, Table.PlayerGrudgelove);
  config.playerboots = readConfig(fifa, Table.PlayerBoots);
  config.playerloans = readConfig(fifa, Table.PlayerLoans);
  config.playernames = readConfig(fifa, Table.PlayerNames);
  config.players = readConfig(fifa, Table.Players);
  config.previousteam = readConfig(fifa, Table.PreviousTeam);
  config.referee = readConfig(fifa, Table.Referee);
  config.rivals = readConfig(fifa, Table.Rivals);
  config.rowteamnationlinks = readConfig(fifa, Table.RowTeamNationLinks);
  config.shoecolors = readConfig(fifa, Table.ShoeColors);
  config.stadiums = readConfig(fifa, Table.Stadiums);
  config.teamballs = readConfig(fifa, Table.TeamBalls);
  config.teamkits = readConfig(fifa, Table.TeamKits);
  config.teamnationlinks = readConfig(fifa, Table.TeamNationLinks);
  config.teamplayerlinks = readConfig(fifa, Table.TeamPlayerLinks);
  config.teams = readConfig(fifa, Table.Teams);
  config.teamstadiumlinks = readConfig(fifa, Table.TeamStadiumLinks);
  return config;
};
