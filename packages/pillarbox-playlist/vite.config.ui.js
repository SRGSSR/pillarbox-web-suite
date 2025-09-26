import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';

/**
 * Vite's configuration for the ui build.
 *
 * Outputs:
 * - 'dist/ui/pillarbox-playlist-ui.js': ESModule version with sourcemaps.
 * - 'dist/ui/pillarbox-playlist-ui.cjs': CommonJS version with sourcemaps.
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
      external: ['video.js', '@srgssr/svg-button'],
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
      plugins: [
        babel({
          babelHelpers: 'bundled',
          exclude: 'node_modules/**'
        }),
        copy({
          targets: [{ src: 'src/lang/*.json', dest: 'dist/lang' }],
          hook: 'writeBundle'
        })
      ]
    }
  }
});
