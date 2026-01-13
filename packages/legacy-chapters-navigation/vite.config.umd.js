import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import { entry, name, outDir, output } from './.build.config.js';

/**
 * Vite's configuration for the umd build.
 *
 * Outputs:
 * - 'dist/legacy-chapters-navigation.umd.min.js': Universal Module Definition version.
 */
export default defineConfig({
  esbuild: false,
  build: {
    outDir: outDir,
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      formats: ['umd'],
      name: name,
      entry: entry
    },
    rollupOptions: {
      output: {
        name: name,
        entryFileNames: `${output}.umd.min.js`,
        globals: {
          pillarbox: 'pillarbox',
        },
      },
      external: ['@srgssr/pillarbox-web', 'video.js', '@srgssr/chapter-bar', '@srgssr/svg-button'],
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
