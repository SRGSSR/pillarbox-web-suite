import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import babelConfig from '../../babel.config.json' with { type: 'json' };


/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/chapters-bar.js': ESModule version with sourcemaps.
 * - 'dist/chapters-bar.cjs': CommonJS version with sourcemaps.
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
      name: 'ChaptersBar',
      entry: 'src/chapters-bar.js'
    },
    rolldownOptions: {
      external: ['@srgssr/pillarbox-web', 'video.js']
    }
  }
});
