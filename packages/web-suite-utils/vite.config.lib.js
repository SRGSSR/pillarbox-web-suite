import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import babelConfig from '../../babel.config.json' with { type: 'json' };


/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/web-suite-utils.js': ESModule version with sourcemaps.
 * - 'dist/web-suite-utils.cjs': CommonJS version with sourcemaps.
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
      formats: ['es', 'cjs'],
      name: 'WebSuiteUtils',
      entry: 'src/index.js'
    }
  }
});
