import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import babelConfig from '../../babel.config.json' with { type: 'json' };

/**
 * Vite's configuration for the lib build.
 *
 * Outputs:
 * - 'dist/pillarbox-debug-panel.js': ESModule version with sourcemaps.
 * - 'dist/pillarbox-debug-panel.cjs': CommonJS version with sourcemaps.
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
      name: 'PillarboxDebugPanel',
      entry: 'src/pillarbox-debug-panel.js'
    },
    rolldownOptions: {
      external: ['video.js']
    }
  }
});
