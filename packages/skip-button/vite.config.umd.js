import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

/**
 * Vite's configuration for the umd build.
 *
 * Outputs:
 * - 'dist/skip-button.umd.min.js': Universal Module Definition version.
 */
export default defineConfig({
  esbuild: false,
  build: {
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      formats: ['umd'],
      name: 'SkipButton',
      entry: 'src/skip-button.js'
    },
    rollupOptions: {
      output: {
        name: 'SkipButton',
        entryFileNames: 'skip-button.umd.min.js',
        globals: {
          pillarbox: 'pillarbox'
        },
      },
      external: ['@srgssr/pillarbox-web'],
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
