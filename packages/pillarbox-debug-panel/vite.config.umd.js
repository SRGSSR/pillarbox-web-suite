import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import babelConfig from '../../babel.config.json' with { type: 'json' };

/**
 * Vite's configuration for the UMD build.
 *
 * Outputs:
 * - 'dist/pillarbox-debug-panel.umd.min.js': Universal Module Definition version.
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
      name: 'PillarboxDebugPanel',
      entry: 'src/pillarbox-debug-panel.js'
    },
    rolldownOptions: {
      output: {
        name: 'PillarboxDebugPanel',
        entryFileNames: 'pillarbox-debug.umd.min.js',
        globals: {
          videojs: 'videojs',
        },
      },
      external: ['video.js']
    }
  }
});
