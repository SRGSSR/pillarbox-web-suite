import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import babelConfig from '../../babel.config.json' with { type: 'json' };
import { entry, outDir, output } from './.build.config.js';

/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/srg-ssr-theme.js': ESModule version with sourcemaps.
 * - 'dist/srg-ssr-theme.cjs': CommonJS version with sourcemaps.
 */
export default defineConfig({
  plugins: [
    babel({
      presets: babelConfig.presets
    })
  ],
  oxc: false,
  build: {
    outDir: outDir,
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      formats: ['es', 'cjs'],
      entry: entry
    },
    rolldownOptions: {
      external: [
        '@srgssr/pillarbox-web',
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
      ]
    }
  }
});
