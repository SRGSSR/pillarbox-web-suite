import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';

/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/google-cast-sender.js': ESModule version with sourcemaps.
 * - 'dist/google-cast-sender.cjs': CommonJS version with sourcemaps.
 */
export default defineConfig({
  esbuild: false,
  build: {
    sourcemap: true,
    lib: {
      formats: ['es', 'cjs'],
      name: 'GoogleCastSender',
      entry: 'src/google-cast-sender.js'
    },
    rollupOptions: {
      external: ['video.js'],
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
