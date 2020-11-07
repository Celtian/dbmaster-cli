import { copyFileSync } from 'fs';

const copyFiles = ['README.md', 'LICENSE'];
for (const file of copyFiles) {
  copyFileSync(`./${file}`, `./dist/${file}`);
}
