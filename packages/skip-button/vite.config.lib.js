import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import babelConfig from '../../babel.config.json' with { type: 'json' };
import copy from 'rollup-plugin-copy';

/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/skip-button.js': ESModule version with sourcemaps.
 * - 'dist/skip-button.cjs': CommonJS version with sourcemaps.
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
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      formats: ['es', 'cjs'],
      name: 'SkipButton',
      entry: 'src/skip-button.js'
    },
    rolldownOptions: {
      external: ['@srgssr/pillarbox-web']
    }
  }
});
