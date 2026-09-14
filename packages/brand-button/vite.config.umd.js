import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import babelConfig from '../../babel.config.json' with { type: 'json' };

/**
 * Vite's configuration for the umd build.
 *
 * Outputs:
 * - 'dist/brand-button.umd.min.js': Universal Module Definition version.
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
      name: 'BrandButton',
      entry: 'src/brand-button.js'
    },
    rolldownOptions: {
      output: {
        name: 'BrandButton',
        entryFileNames: 'brand-button.umd.min.js',
        globals: {
          videojs: 'videojs',
        },
      },
      external: ['video.js'],
    },
  },
});
