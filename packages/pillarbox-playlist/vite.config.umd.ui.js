import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

/**
 * Vite's configuration for the umd UI build.
 *
 * Outputs:
 * - 'dist/ui/pillarbox-playlist-ui.umd.min.js': Universal Module Definition version.
 */
export default defineConfig({
  esbuild: false,
  build: {
    outDir: 'dist/ui',
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      formats: ['umd'],
      name: 'PillarboxPlaylistUI',
      entry: 'src/pillarbox-playlist-ui.js'
    },
    rollupOptions: {
      output: {
        name: 'PillarboxPlaylistUI',
        entryFileNames: 'pillarbox-playlist-ui.umd.min.js',
        globals: {
          videojs: 'videojs'
        },
      },
      external: ['video.js'],
      plugins: [
        babel({
          babelHelpers: 'bundled',
          exclude: 'node_modules/**'
        }),
        terser()
      ]
    },
  },
});
