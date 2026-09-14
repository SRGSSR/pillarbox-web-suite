import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import babelConfig from '../../babel.config.json' with { type: 'json' };

/**
 * Vite's configuration for the umd build.
 *
 * Outputs:
 * - 'dist/skip-button.umd.min.js': Universal Module Definition version.
 */
export default defineConfig({
  plugins: [
    babel({
      presets: babelConfig.presets
    })
  ],
  oxc: false,
  build: {
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      formats: ['umd'],
      name: 'SkipButton',
      entry: 'src/skip-button.js'
    },
    rolldownOptions: {
      output: {
        name: 'SkipButton',
        entryFileNames: 'skip-button.umd.min.js',
        globals: {
          pillarbox: 'pillarbox'
        },
      },
      external: ['@srgssr/pillarbox-web']
    },
  },
});
