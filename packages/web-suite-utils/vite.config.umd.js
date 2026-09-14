import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import babelConfig from '../../babel.config.json' with { type: 'json' };

/**
 * Vite's configuration for the umd build.
 *
 * Outputs:
 * - 'dist/web-suite-utils.umd.min.js': Universal Module Definition version.
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
      name: 'WebSuiteUtils',
      entry: 'src/index.js'
    },
    rolldownOptions: {
      output: {
        name: 'WebSuiteUtils',
        entryFileNames: 'web-suite-utils.umd.min.js',
      },
    },
  },
});
