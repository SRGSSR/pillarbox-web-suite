import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import * as process from 'node:process';

const entryMap = {
  sender: {
    entry: 'src/google-cast-sender.js',
    output: 'google-cast-sender',
    outDir: 'dist',
  },
  button: {
    entry: 'src/components/google-cast-button.js',
    output: 'google-cast-button',
    outDir: 'dist/button',
  }
};
const target = process.env.BUILD_TARGET;
const { entry, output, outDir } = entryMap[target];

/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/google-cast-sender.js': ESModule version with sourcemaps.
 * - 'dist/google-cast-sender.cjs': CommonJS version with sourcemaps.
 * - 'dist/launcher/google-cast-launcher.js': ESModule version with sourcemaps.
 * - 'dist/launcher/google-cast-launcher.cjs': CommonJS version with sourcemaps.
 * - 'dist/button/google-cast-button.js': ESModule version with sourcemaps.
 * - 'dist/button/google-cast-button.cjs': CommonJS version with sourcemaps.
 */
export default defineConfig({
  esbuild: false,
  build: {
    outDir: outDir,
    sourcemap: true,
    lib: {
      formats: ['es', 'cjs'],
      entry: entry
    },
    rollupOptions: {
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
      ],
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
