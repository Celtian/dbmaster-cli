import chalk from 'chalk';
import { platform, release } from 'os';
import { default as osName } from 'os-name';
import { BANNER } from '../lib/ui';
import { version } from '../package.json';
import { AbstractAction } from './abstract.action';

export class InfoAction extends AbstractAction {
  public async handle(): Promise<void> {
    displayBanner();
    displaySystemInformation();
    displayCliInformation();
  }
}

const displayBanner = () => {
  console.info(chalk.white(BANNER));
};

const displaySystemInformation = (): void => {
  console.info(chalk.green('[System Information]'));
  console.info('OS Version     :', chalk.blue(osName(platform(), release())));
  console.info('NodeJS Version :', chalk.blue(process.version));
};

const displayCliInformation = () => {
  console.info(chalk.green('[Cli Information]'));
  console.info('Cli Version    :', chalk.blue(version));
};
