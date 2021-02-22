import { join } from 'path';
import { cwd } from 'process';
import { FifaConfig, fifaConfigFactory } from './lib/fifa-config';
import { Fifa } from './lib/interfaces';
import { applyCountryRulesOnPlayersAndPlayernames } from './lib/utils/playernames';

const fifa = Fifa.Fifa16;
const config: FifaConfig = fifaConfigFactory(fifa);
const inputFolder = join(cwd(), 'examples', 'fifa16');
const outputFolder = join(cwd(), 'output', 'fifa16');

// tslint:disable-next-line: no-floating-promises
applyCountryRulesOnPlayersAndPlayernames(fifa, inputFolder, outputFolder).then((x) => console.log('done', x));
