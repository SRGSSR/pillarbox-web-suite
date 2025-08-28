import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';


/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/thumbnail-preview.js': ESModule version with sourcemaps.
 * - 'dist/thumbnail-preview.cjs': CommonJS version with sourcemaps.
 */
export default defineConfig({
  esbuild: false,
  build: {
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      formats: ['es', 'cjs'],
      name: 'ThumbnailPreview',
      entry: 'src/thumbnail-preview.js'
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
