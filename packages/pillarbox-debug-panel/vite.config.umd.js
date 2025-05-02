import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

/**
 * Vite's configuration for the UMD build.
 *
 * Outputs:
 * - 'dist/pillarbox-debug-panel.umd.min.js': ESModule version with sourcemaps.
 */
export default defineConfig({
  esbuild: false,
  build: {
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      formats: ['umd'],
      name: 'PillarboxDebugPanel',
      entry: 'src/pillarbox-debug-panel.js'
    },
    rollupOptions: {
      output: {
        name: 'PillarboxDebugPanel',
        entryFileNames: 'pillarbox-debug.umd.min.js',
        globals: {
          videojs: 'videojs',
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
    }
  }
});
