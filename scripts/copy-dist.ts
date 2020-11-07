import { copyFileSync } from 'fs';

// Copy README into dist folder
const copyFiles = ['README.md'];
for (const file of copyFiles) {
  copyFileSync(`./${file}`, `./dist/${file}`);
}
