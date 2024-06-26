import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';

/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/skip-button.js': ESModule version with sourcemaps.
 * - 'dist/skip-button.cjs': CommonJS version with sourcemaps.
 */
export default defineConfig({
  esbuild: false,
  build: {
    sourcemap: true,
    lib: {
      formats: ['es', 'cjs'],
      name: 'SkipButton',
      entry: 'src/skip-button.js'
    },
    rollupOptions: {
      external: ['@srgssr/pillarbox-web'],
      plugins: [
        babel({
          babelHelpers: 'bundled',
          exclude: 'node_modules/**'
        }),
        copy({
          targets: [{ src: 'src/lang/*.json', dest: 'dist/lang' }],
          hook: 'writeBundle'
        })
      ]
    }
  }
});
