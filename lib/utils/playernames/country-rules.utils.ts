import { ReadWriteStreamBuilder, WriteStreamBuilder } from '../../actions';
import { FifaConfig, fifaConfigFactory } from '../../fifa-config';
import { Field, Fifa, RawData, Table } from '../../interfaces';
import { indexedMap } from '../index.utils';
import { PlayernamesCountry, PlayerPlayernames } from './interfaces';

const editSaudiArabian = (names: PlayerPlayernames): PlayerPlayernames => {
  if (names.jerseyName !== names.firstName && names.jerseyName !== names.lastName) {
    names.lastName = names.jerseyName;
  }
  return names;
};

const editKorean = (names: PlayerPlayernames): PlayerPlayernames => {
  let originalFirstName = names.firstName;
  const originalLastName = names.lastName;
  let originalCommonName = names.commonName;
  if (originalFirstName) {
    originalFirstName = originalFirstName.replace(' ', '-');
    names.firstName = '';
  }
  if (originalLastName) {
    names.lastName = '';
  }
  if (originalCommonName) {
    const firstSpace = originalCommonName.indexOf(' ');
    const lastSpace = originalCommonName.lastIndexOf(' ');
    if (firstSpace !== lastSpace) {
      originalCommonName =
        originalCommonName.substring(0, lastSpace) + '-' + originalCommonName.substring(lastSpace + 1);
    }
  } else {
    originalCommonName = originalFirstName + ' ' + originalLastName;
  }
  names.commonName = originalCommonName;
  names.jerseyName = names.commonName;
  return names;
};

const editBrazilian = (names: PlayerPlayernames): PlayerPlayernames => {
  if (names.firstName !== names.jerseyName && names.firstName.includes(names.jerseyName)) {
    names.firstName = names.jerseyName;
  }
  const firstSpace = names.jerseyName.indexOf(' ');
  if (firstSpace !== -1) {
    const preSpace = names.jerseyName.substring(0, firstSpace);
    const afterSpace = names.jerseyName.substring(firstSpace + 1);
    if (names.firstName.includes(preSpace) && names.lastName.includes(afterSpace)) {
      names.firstName = preSpace;
      names.lastName = afterSpace;
    }
  }
  return names;
};

const editPortuguese = (names: PlayerPlayernames): PlayerPlayernames => {
  const firstSpace = names.jerseyName.indexOf(' ');
  if (firstSpace !== -1) {
    const beforeSpace = names.jerseyName.substring(0, firstSpace);
    const afterSpace = names.jerseyName.substring(firstSpace + 1);
    if (names.firstName.includes(beforeSpace) && names.lastName.includes(afterSpace)) {
      names.firstName = beforeSpace;
      names.lastName = afterSpace;
    }
  }
  return names;
};

const editSpanish = (names: PlayerPlayernames): PlayerPlayernames => {
  if (names.jerseyName && names.lastName !== names.jerseyName) {
    if (names.lastName.includes(names.jerseyName)) {
      names.lastName = names.jerseyName;
    }
    const firstSpace = names.jerseyName.indexOf(' ');
    if (firstSpace !== -1) {
      const afterSpace = names.jerseyName.substring(firstSpace + 1);
      if (names.lastName !== afterSpace && names.lastName.includes(afterSpace + ' ')) {
        names.lastName = afterSpace;
      }
    }
    return names;
  } else {
    return names;
  }
};

export const applyCountryRules = (countryId: number, names: PlayerPlayernames): PlayerPlayernames => {
  switch (countryId) {
    case PlayernamesCountry.SaudiArabia:
      return editSaudiArabian(names);
    case PlayernamesCountry.KoreaDPR:
    case PlayernamesCountry.KoreaRepublic:
      return editKorean(names);
    case PlayernamesCountry.Brazil:
      return editBrazilian(names);
    case PlayernamesCountry.Portugal:
      return editPortuguese(names);
    case PlayernamesCountry.Spain:
      return editSpanish(names);
    default:
      return names;
  }
};

const applyCountryRulesToPlayer = async (
  fields: Field[],
  inputFolder: string,
  outputFolder: string,
  playernamesMap: Map<number, RawData>
): Promise<void> => {
  return new Promise(async (resolve, reject) =>
    new ReadWriteStreamBuilder(inputFolder, Table.Players, fields)
      .actionApplyCountryRulesToPlayers(fields, playernamesMap)
      .actionWrite(outputFolder, fields)
      .onFinish(() => resolve())
      .onError(() => reject())
  );
};

const applyCountryRulesToPlayernames = async (
  config: FifaConfig,
  outputFolder: string,
  playernamesMap: Map<number, RawData>
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const stream = new WriteStreamBuilder(Table.PlayerNames)
      .actionOnData((x) => console.log('1', x))
      // .actionWrite(outputFolder, config.playernames)
      // .actionOnData((x) => console.log('2',x))
      /*
        .onPipe()
        .actionOnData((x) => console.log('1',x))
        .actionWrite(outputFolder, config.playernames)
        .actionOnData((x) => console.log('2',x))
        */
      .onFinish(() => resolve())
      .onError(() => reject());

    for (const [key, value] of playernamesMap.entries()) {
      stream.write(`${JSON.stringify(value)}\r\n`);
    }

    stream.close();
  });
};

export const applyCountryRulesOnPlayersAndPlayernames = async (
  fifa: Fifa,
  inputFolder: string,
  outputFolder: string
) => {
  const config: FifaConfig = fifaConfigFactory(fifa);
  const mapPlayerNames = await indexedMap(inputFolder, Table.PlayerNames, config.playernames);
  const mapDcPlayernames = await indexedMap(inputFolder, Table.DcPlayerNames, config.dcplayernames);
  const playernamesMap = new Map([...mapDcPlayernames, ...mapPlayerNames]);

  // console.log(playernamesMap);
  console.log(playernamesMap.size);
  // await applyCountryRulesToPlayer(config.players, inputFolder, outputFolder, playernamesMap);

  await applyCountryRulesToPlayernames(config, outputFolder, playernamesMap);

  /*
  const output = join(outputFolder, `test.txt`);

  writeFileSync(
    output,
    JSON.stringify(Object.values(playernamesMap))
  );
  */
};
