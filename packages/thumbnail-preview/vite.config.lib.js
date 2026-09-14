import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import babelConfig from '../../babel.config.json' with { type: 'json' };


/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/thumbnail-preview.js': ESModule version with sourcemaps.
 * - 'dist/thumbnail-preview.cjs': CommonJS version with sourcemaps.
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
      name: 'ThumbnailPreview',
      entry: 'src/thumbnail-preview.js'
    },
    rolldownOptions: {
      external: ['video.js']
    }
  }
});
