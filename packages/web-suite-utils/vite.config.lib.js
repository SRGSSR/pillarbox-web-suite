import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';


/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/web-suite-utils.js': ESModule version with sourcemaps.
 * - 'dist/web-suite-utils.cjs': CommonJS version with sourcemaps.
 */
export default defineConfig({
  esbuild: false,
  build: {
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      formats: ['es', 'cjs'],
      name: 'WebSuiteUtils',
      entry: 'src/index.js'
    },
    rollupOptions: {
      plugins: [
        babel({
          babelHelpers: 'bundled',
          exclude: 'node_modules/**'
        })
      ]
    }
  }
});
