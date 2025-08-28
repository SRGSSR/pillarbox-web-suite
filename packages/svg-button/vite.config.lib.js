import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';


/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/svg-button.js': ESModule version with sourcemaps.
 * - 'dist/svg-button.cjs': CommonJS version with sourcemaps.
 */
export default defineConfig({
  esbuild: false,
  build: {
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      formats: ['es', 'cjs'],
      name: 'SvgButton',
      entry: 'src/index.js'
    },
    rollupOptions: {
      external: ['video.js', '@srgssr/web-suite-utils'],
      plugins: [
        babel({
          babelHelpers: 'bundled',
          exclude: 'node_modules/**'
        })
      ]
    }
  }
});
