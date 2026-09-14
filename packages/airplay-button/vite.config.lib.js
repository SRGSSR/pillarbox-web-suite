import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import babelConfig from '../../babel.config.json' with { type: 'json' };
import copy from 'rollup-plugin-copy';

/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/airplay-button.js': ESModule version with sourcemaps.
 * - 'dist/airplay-button.cjs': CommonJS version with sourcemaps.
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
      name: 'AirplayButton',
      entry: 'src/airplay-button.js'
    },
    rolldownOptions: {
      external: ['video.js', '@srgssr/svg-button']
    }
  }
});
