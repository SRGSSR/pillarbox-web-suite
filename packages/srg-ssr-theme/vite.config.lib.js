import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';
import { entry, outDir, output } from './.build.config.js';


/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/srg-ssr-theme.js': ESModule version with sourcemaps.
 * - 'dist/srg-ssr-theme.cjs': CommonJS version with sourcemaps.
 */
export default defineConfig({
  esbuild: false,
  build: {
    outDir: outDir,
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      formats: ['es', 'cjs'],
      entry: entry
    },
    rollupOptions: {
      external: [
        'video.js',
        '@srgssr/airplay-button',
        '@srgssr/google-cast-sender',
        '@srgssr/google-cast-sender/button',
        '@srgssr/live-dvr-time-display',
        '@srgssr/srg-ssr-hotkeys',
        '@srgssr/user-preferences'
      ],
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
