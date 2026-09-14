import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import babelConfig from '../../babel.config.json' with { type: 'json' };
import { entry, name, outDir, output } from './.build.config.js';

/**
 * Vite's configuration for the umd build.
 *
 * Outputs:
 * - 'dist/google-cast-sender.umd.min.js': Universal Module Definition version.
 * - 'dist/button/google-cast-button.umd.min.js': Universal Module Definition version.
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
      formats: ['umd'],
      name: name,
      entry: entry
    },
    rolldownOptions: {
      output: {
        name: name,
        entryFileNames: `${output}.umd.min.js`,
        globals: {
          videojs: 'videojs',
        },
      },
      external: ['video.js'],
    },
  },
});
