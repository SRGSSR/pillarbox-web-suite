import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import babelConfig from '../../babel.config.json' with { type: 'json' };


/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/svg-button.js': ESModule version with sourcemaps.
 * - 'dist/svg-button.cjs': CommonJS version with sourcemaps.
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
      name: 'SvgButton',
      entry: 'src/index.js'
    },
    rolldownOptions: {
      external: ['video.js', '@srgssr/web-suite-utils']
    }
  }
});
