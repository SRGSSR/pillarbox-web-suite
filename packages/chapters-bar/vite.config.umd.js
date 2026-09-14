import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import babelConfig from '../../babel.config.json' with { type: 'json' };

/**
 * Vite's configuration for the umd build.
 *
 * Outputs:
 * - 'dist/chapters-bar.umd.min.js': Universal Module Definition version.
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
      name: 'ChaptersBar',
      entry: 'src/chapters-bar.js'
    },
    rolldownOptions: {
      output: {
        name: 'ChaptersBar',
        entryFileNames: 'chapters-bar.umd.min.js',
        globals: {
          pillarbox: 'pillarbox',
        },
      },
      external: ['@srgssr/pillarbox-web', 'video.js'],
    },
  },
});
