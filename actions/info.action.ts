import chalk from 'chalk';
import { platform, release } from 'os';
import { default as osName } from 'os-name';
import { version } from '../package.json';
import { BANNER } from '../src/ui';
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
  console.info('OS Version     :', chalk.yellow(osName(platform(), release())));
  console.info('NodeJS Version :', chalk.yellow(process.version));
};

const displayCliInformation = () => {
  console.info(chalk.green('[Cli Information]'));
  console.info('Cli Version    :', chalk.yellow(version));
};
