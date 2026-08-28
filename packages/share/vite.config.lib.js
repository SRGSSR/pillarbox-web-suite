import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';
import { entry, outDir, output } from './.build.config.js';

/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/share.js': ESModule version with sourcemaps.
 * - 'dist/share.cjs': CommonJS version with sourcemaps.
 */
export default defineConfig({
  esbuild: false,
  build: {
    outDir,
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      formats: ['es', 'cjs'],
      entry
    },
    rollupOptions: {
      external: ['video.js'],
      output: [
        {
          format: 'es',
          entryFileNames: `${output}.js`
        },
        {
          format: 'cjs',
          entryFileNames: `${output}.cjs`
        }
      ],
      plugins: [
        babel({
          babelHelpers: 'bundled',
          exclude: 'node_modules/**'
        })
      ]
    }
  }
});
