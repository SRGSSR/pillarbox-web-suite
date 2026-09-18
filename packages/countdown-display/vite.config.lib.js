import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import babelConfig from '../../babel.config.json' with { type: 'json' };
import { entry, outDir, output } from './.build.config.js';
import copy from 'rollup-plugin-copy';

/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/countdown-display.js': ESModule version with sourcemaps.
 * - 'dist/countdown-display.cjs': CommonJS version with sourcemaps.
 */
export default defineConfig({
  plugins: [
    babel({
      presets: babelConfig.presets
    }),
    copy({
      targets: [{ src: 'src/lang/*.json', dest: 'dist/lang' }],
      hook: 'writeBundle'
    })
  ],
  oxc: false,
  build: {
    outDir: outDir,
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      formats: ['es', 'cjs'],
      entry: entry
    },
    rolldownOptions: {
      external: ['video.js'],
      output: [
        {
          format: 'es',
          entryFileNames: `${output}.js`
        },
        {
          format: 'cjs',
          entryFileNames: `${output}.cjs`
        }
      ]
    }
  }
});
