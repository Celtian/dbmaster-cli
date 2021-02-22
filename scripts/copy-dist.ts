import { copyFileSync } from 'fs';
import { copySync } from 'fs-extra';
import { join } from 'path';
import { cwd } from 'process';

console.log('Copying README.ms & LICENSE into dist.');

const copyFiles = ['README.md', 'LICENSE'];
for (const file of copyFiles) {
  copyFileSync(`./${file}`, `./dist/${file}`);
}

console.log('Copying configurations into dist.');

const srcDir = join(cwd(), 'cfg');
const destDir = join(cwd(), 'dist', 'cfg');

copySync(srcDir, destDir);
