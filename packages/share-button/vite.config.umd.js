import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import babelConfig from '../../babel.config.json' with { type: 'json' };
import { entry, name, outDir, output } from './.build.config.js';

/**
 * Vite's configuration for the umd build.
 *
 * Outputs:
 * - 'dist/share-button.umd.min.js': Universal Module Definition version.
 */
export default defineConfig({
  plugins: [
    babel({
      presets: babelConfig.presets
    })
  ],
  oxc: false,
  build: {
    outDir,
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      formats: ['umd'],
      name,
      entry
    },
    rolldownOptions: {
      output: {
        name,
        entryFileNames: `${output}.umd.min.js`,
        globals: {
          'video.js': 'videojs',
        },
      },
      external: ['video.js']
    }
  }
});
