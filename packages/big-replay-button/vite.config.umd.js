import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import babelConfig from '../../babel.config.json' with { type: 'json' };

/**
 * Vite's configuration for the umd build.
 *
 * Outputs:
 * - 'dist/big-replay-button.umd.min.js': Universal Module Definition version.
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
      name: 'BigReplayButton',
      entry: 'src/big-replay-button.js'
    },
    rolldownOptions: {
      output: {
        name: 'BigReplayButton',
        entryFileNames: 'big-replay-button.umd.min.js',
        globals: {
          videojs: 'videojs',
        },
      },
      external: ['video.js'],
    },
  },
});
