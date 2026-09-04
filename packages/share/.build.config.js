/**
 * Build configuration resolver for the share package.
 */
import { env } from 'node:process';

const entryMap = {
  default: {
    entry: 'src/share.js',
    output: 'share',
    outDir: 'dist',
    name: 'VideojsShare'
  }
};

const target = env.BUILD_TARGET ?? 'default';

if (!(target in entryMap)) {
  throw new Error(`Unknown build target: "${target}". Valid options: ${Object.keys(entryMap).join(', ')}`);
}

export const { entry, output, outDir, name } = entryMap[target];
