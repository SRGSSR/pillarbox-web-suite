import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import babelConfig from '../../babel.config.json' with { type: 'json' };
import copy from 'rollup-plugin-copy';
import { entry, outDir, output } from './.build.config.js';

/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/google-cast-sender.js': ESModule version with sourcemaps.
 * - 'dist/google-cast-sender.cjs': CommonJS version with sourcemaps.
 * - 'dist/button/google-cast-button.js': ESModule version with sourcemaps.
 * - 'dist/button/google-cast-button.cjs': CommonJS version with sourcemaps.
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
      external: ['video.js', '@srgssr/svg-button'],
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
