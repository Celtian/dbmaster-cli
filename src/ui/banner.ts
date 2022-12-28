import chalk from 'chalk';
import { default as figlet } from 'figlet';

export const BANNER = chalk.white(figlet.textSync('dbmaster-cli', { horizontalLayout: 'full' }));
