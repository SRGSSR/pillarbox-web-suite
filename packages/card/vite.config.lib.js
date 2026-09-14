import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import babelConfig from '../../babel.config.json' with { type: 'json' };


/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/card.js': ESModule version with sourcemaps.
 * - 'dist/card.cjs': CommonJS version with sourcemaps.
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
      name: 'Card',
      entry: 'src/index.js'
    },
    rolldownOptions: {
      external: ['video.js']
    }
  }
});
