import { execSync } from 'child_process';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { rm } from 'fs/promises';

function printHelp() {
  console.log(
    `Usage: node run-all.js [prefix] [--no-clean]

Runs all npm scripts whose name starts with "<prefix>:".

Arguments:
  prefix        Optional. Defaults to "build".
Flags:
  --no-clean    Do not delete ./dist before running.
  -h, --help    Show this help and exit.`
  );
}

const argv = process.argv.slice(2);

let prefix = 'build';
let clean = true;

for (const a of argv) {
  if (a === '-h' || a === '--help') {
    printHelp();
    process.exit(0);
  } else if (a === '--no-clean') {
    clean = false;
  } else if (!a.startsWith('--')) {
    prefix = a;
  } else {
    console.error(`Unknown argument: ${a}\n`);
    printHelp();
    process.exit(1);
  }
}

async function readScripts(pkgPath, prefix) {
  try {
    const pkgRaw = await readFile(pkgPath, 'utf-8');
    const pkg = JSON.parse(pkgRaw);

    return Object.keys(pkg.scripts).filter(name => name.startsWith(`${prefix}:`));
  } catch (err) {
    console.error(`Failed to read/parse ${pkgPath}:`, err?.message || err);
    process.exit(1);
  }
}

const pkgPath = resolve('./package.json');
const scripts = await readScripts(pkgPath, prefix);

if (!scripts.length) {
  console.error(`No scripts found with prefix "${prefix}:" in ${pkgPath}`);
  process.exit(1);
}

if (clean) {
  console.log('Deleting dist folder...');
  try {
    await rm('dist', { recursive: true, force: true });
  } catch (err) {
    console.error('Failed to delete dist:', err?.message || err);
    process.exit(1);
  }
} else {
  console.log('Skipping dist cleanup (--no-clean).');
}

console.log(`Running scripts with prefix "${prefix}":`, scripts.join(', '));

for (const script of scripts) {
  execSync(`npm run ${script}`, { stdio: 'inherit' });
}
