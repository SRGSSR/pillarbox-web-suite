/**
 * Build configuration resolver
 *
 * Resolves a build entry from `targetMap` based on `BUILD_TARGET`,
 * defaulting to "default". Each entry defines `entry`, `output`,
 * `outDir`, and UMD/global `name`. Unknown targets throw an error.
 *
 * Usage:
 *   import { entry, output, outDir, name } from './build.config.js';
 */
import { env } from 'node:process';

/**
 * Adding a new build target:
 *    1. Add an entry to `targetMap` with the desired configuration.
 *    2. Define the npm scripts prefixed with `build:` in your `package.json`
 *       for building the new target.
 *       ```
 *       BUILD_TARGET=${target_name} vite build --config vite.config.lib.js
 *       BUILD_TARGET=${target_name} vite build --config vite.config.lib.js
 *       ```
 *    3. Run all build targets automatically using the helper script: `npm run build`.
 *       The script discovers all `build:*` scripts in your package.json and runs
 *       them sequentially, no manual aggregation is needed.
 */
const entryMap = {
  default: {
    entry: 'src/chapter-navigation.js',
    output: 'chapter-navigation',
    outDir: 'dist',
    name: 'ChapterNavigation',
  }
};

const target = env.BUILD_TARGET ?? 'default';

if (!(target in entryMap)) {
  throw new Error(`Unknown build target: "${target}". Valid options are: ${Object.keys(entryMap).join(', ')}`);
}

export const { entry, output, outDir, name } = entryMap[target];

