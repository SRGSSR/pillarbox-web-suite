import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import babelConfig from '../../babel.config.json' with { type: 'json' };
import { entry, outDir, output } from './.build.config.js';


/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/srg-ssr-hotkeys.js': ESModule version with sourcemaps.
 * - 'dist/srg-ssr-hotkeys.cjs': CommonJS version with sourcemaps.
 */
export default defineConfig({
  plugins: [
    babel({
      presets: babelConfig.presets
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
