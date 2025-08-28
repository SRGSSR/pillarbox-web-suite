import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';

/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/airplay-button.js': ESModule version with sourcemaps.
 * - 'dist/airplay-button.cjs': CommonJS version with sourcemaps.
 */
export default defineConfig({
  esbuild: false,
  build: {
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      formats: ['es', 'cjs'],
      name: 'AirplayButton',
      entry: 'src/airplay-button.js'
    },
    rollupOptions: {
      external: ['video.js', '@srgssr/svg-button'],
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
