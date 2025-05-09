import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';

/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/brand-button.js': ESModule version with sourcemaps.
 * - 'dist/brand-button.cjs': CommonJS version with sourcemaps.
 */
export default defineConfig({
  esbuild: false,
  build: {
    sourcemap: true,
    lib: {
      formats: ['es', 'cjs'],
      name: 'BrandButton',
      entry: 'src/brand-button.js'
    },
    rollupOptions: {
      external: ['video.js'],
      plugins: [
        babel({
          babelHelpers: 'bundled',
          exclude: 'node_modules/**'
        })
      ]
    }
  }
});
