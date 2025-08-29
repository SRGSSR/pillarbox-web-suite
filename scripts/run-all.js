import { execSync } from 'child_process';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { rm } from 'fs/promises';

const pkgPath = resolve('./package.json');
const prefix = process.argv[2] || 'build';
const pkgRaw = await readFile(pkgPath, 'utf-8');
const pkg = JSON.parse(pkgRaw);
const scripts = Object.keys(pkg.scripts).filter(name => name.startsWith(`${prefix}:`));

if (!scripts.length) {
  console.error(`No scripts found with prefix "${prefix}:" in ${pkgPath}`);
  process.exit(1);
}

console.log('Deleting dist folder...');
await rm('dist', { recursive: true, force: true });

console.log(`Running scripts with prefix "${prefix}":`, scripts.join(', '));

for (const script of scripts) {
  execSync(`npm run ${script}`, { stdio: 'inherit' });
}
