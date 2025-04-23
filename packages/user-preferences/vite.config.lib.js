import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';


/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/user-preferences.js': ESModule version with sourcemaps.
 * - 'dist/user-preferences.cjs': CommonJS version with sourcemaps.
 */
export default defineConfig({
  esbuild: false,
  build: {
    sourcemap: true,
    lib: {
      formats: ['es', 'cjs'],
      name: 'UserPreferences',
      entry: 'src/user-preferences.js'
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
