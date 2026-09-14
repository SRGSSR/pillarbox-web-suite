import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import babelConfig from '../../babel.config.json' with { type: 'json' };


/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/user-preferences.js': ESModule version with sourcemaps.
 * - 'dist/user-preferences.cjs': CommonJS version with sourcemaps.
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
      name: 'UserPreferences',
      entry: 'src/user-preferences.js'
    },
    rolldownOptions: {
      external: ['video.js']
    }
  }
});
