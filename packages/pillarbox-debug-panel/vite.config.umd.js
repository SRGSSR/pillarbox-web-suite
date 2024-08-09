import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/pillarbox-debug-panel.js': ESModule version with sourcemaps.
 * - 'dist/pillarbox-debug-panel.cjs': CommonJS version with sourcemaps.
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
      external: ['video.js'],
      output: {
        globals: {
          'video.js': 'videojs'
        }
      },
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
