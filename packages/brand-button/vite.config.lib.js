import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';

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
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      formats: ['es', 'cjs'],
      name: 'BrandButton',
      entry: 'src/brand-button.js'
    },
    rollupOptions: {
      external: ['video.js', '@srgssr/svg-button'],
      plugins: [
        babel({
          babelHelpers: 'bundled',
          exclude: 'node_modules/**'
        })
      ]
    }
  }
});
