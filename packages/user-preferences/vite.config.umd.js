import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

/**
 * Vite's configuration for the umd build.
 *
 * Outputs:
 * - 'dist/user-preferences.umd.min.js': Universal Module Definition version.
 */
export default defineConfig({
  esbuild: false,
  build: {
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      formats: ['umd'],
      name: 'UserPreferences',
      entry: 'src/user-preferences.js'
    },
    rollupOptions: {
      output: {
        name: 'UserPreferences',
        entryFileNames: 'user-preferences.umd.min.js',
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
    },
  },
});
