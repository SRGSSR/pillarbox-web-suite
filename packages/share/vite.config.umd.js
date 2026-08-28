import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import { entry, name, outDir, output } from './.build.config.js';

/**
 * Vite's configuration for the umd build.
 *
 * Outputs:
 * - 'dist/share.umd.min.js': Universal Module Definition version.
 */
export default defineConfig({
  esbuild: false,
  build: {
    outDir,
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      formats: ['umd'],
      name,
      entry
    },
    rollupOptions: {
      output: {
        name,
        entryFileNames: `${output}.umd.min.js`,
        globals: {
          'video.js': 'videojs',
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
