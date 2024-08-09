import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';

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
    sourcemap: true,
    lib: {
      formats: ['es', 'cjs'],
      name: 'PillarboxDebugPanel',
      entry: 'src/pillarbox-debug-panel.js'
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
