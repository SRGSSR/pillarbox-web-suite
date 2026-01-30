import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';
import { entry, outDir, output } from './.build.config.js';
import copy from 'rollup-plugin-copy';

/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/legacy-chapters-navigation.js': ESModule version with sourcemaps.
 * - 'dist/legacy-chapters-navigation.cjs': CommonJS version with sourcemaps.
 */
export default defineConfig({
  esbuild: false,
  build: {
    outDir: outDir,
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      formats: ['es', 'cjs'],
      entry: entry
    },
    rollupOptions: {
      external: ['@srgssr/pillarbox-web', 'video.js', '@srgssr/chapter-bar', '@srgssr/svg-button'],
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
