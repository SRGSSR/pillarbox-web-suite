import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';

/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/pillarbox-playlist-ui.js': ESModule version with sourcemaps.
 * - 'dist/pillarbox-playlist-ui.cjs': CommonJS version with sourcemaps.
 */
export default defineConfig({
  esbuild: false,
  build: {
    outDir: 'dist/ui',
    sourcemap: true,
    lib: {
      formats: ['es', 'cjs'],
      name: 'PillarboxPlaylistUI',
      entry: 'src/pillarbox-playlist-ui.js'
    },
    rollupOptions: {
      external: ['video.js'],
      output: [
        {
          format: 'es',
          entryFileNames: 'pillarbox-playlist-ui.js'
        },
        {
          format: 'cjs',
          entryFileNames: 'pillarbox-playlist-ui.cjs'
        }
      ],
      plugins: [babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      })]
    }
  }
});
