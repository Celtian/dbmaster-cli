import chalk from 'chalk';
import { mkdirSync, writeFileSync } from 'fs';
import { safeDump } from 'js-yaml';
import { dirname, join } from 'path';
import { cwd } from 'process';
import { PersonExtractor } from '../lib/extractors';
import { Fifa } from '../lib/interfaces';

const bootstrap = async (): Promise<void> => {
  for (const fifa of Object.values(Fifa)) {
    console.info(chalk.green(`[${fifa}]`));
    const manager = new PersonExtractor(fifa);
    const input = join(cwd(), 'examples', fifa);
    const output = join(cwd(), 'cfg', 'enums', fifa, 'person.yml');
    const cfg = await manager.getAttributes(input);
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(
      output,
      `# Do not edit by hand. This config is generated.
# Key means id and value means number of occurences.
# Data are taken from tables: 'players' and 'referees'.\n\n${safeDump(cfg)}`
    );
  }
};

// tslint:disable-next-line: no-floating-promises
bootstrap();
