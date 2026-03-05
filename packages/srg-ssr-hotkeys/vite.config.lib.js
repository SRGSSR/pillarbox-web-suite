import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';
import { entry, outDir, output } from './.build.config.js';


/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/srg-ssr-hotkeys.js': ESModule version with sourcemaps.
 * - 'dist/srg-ssr-hotkeys.cjs': CommonJS version with sourcemaps.
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
        })
      ]
    }
  }
});
