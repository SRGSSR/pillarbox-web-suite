import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';

/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/pillarbox-playlist.es.js': ESModule version with sourcemaps.
 * - 'dist/pillarbox-playlist.cjs.js': CommonJS version with sourcemaps.
 */
export default defineConfig({
  esbuild: false,
  build: {
    sourcemap: true,
    lib: {
      formats: ['es', 'cjs'],
      name: 'PillarboxPlaylist',
      entry: 'src/pillarbox-playlist.js'
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
