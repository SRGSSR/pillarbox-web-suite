import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';


/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/chapters-bar.js': ESModule version with sourcemaps.
 * - 'dist/chapters-bar.cjs': CommonJS version with sourcemaps.
 */
export default defineConfig({
  esbuild: false,
  build: {
    sourcemap: true,
    lib: {
      formats: ['es', 'cjs'],
      name: 'ChaptersBar',
      entry: 'src/chapters-bar.js'
    },
    rollupOptions: {
      external: ['@srgssr/pillarbox-web', 'video.js'],
      plugins: [
        babel({
          babelHelpers: 'bundled',
          exclude: 'node_modules/**'
        })
      ]
    }
  }
});
