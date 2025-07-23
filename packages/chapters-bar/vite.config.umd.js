import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

/**
 * Vite's configuration for the umd build.
 *
 * Outputs:
 * - 'dist/chapters-bar.umd.min.js': Universal Module Definition version.
 */
export default defineConfig({
  esbuild: false,
  build: {
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      formats: ['umd'],
      name: 'ChaptersBar',
      entry: 'src/chapters-bar.js'
    },
    rollupOptions: {
      output: {
        name: 'ChaptersBar',
        entryFileNames: 'chapters-bar.umd.min.js',
        globals: {
          pillarbox: 'pillarbox',
        },
      },
      external: ['@srgssr/pillarbox-web', 'video.js'],
      plugins: [
        babel({
          babelHelpers: 'bundled',
          exclude: 'node_modules/**'
        }),
        terser()
      ],
    },
  },
});
