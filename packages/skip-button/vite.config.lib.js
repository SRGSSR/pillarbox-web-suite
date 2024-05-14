import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';

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
      plugins: [babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      })]
    }
  }
});
