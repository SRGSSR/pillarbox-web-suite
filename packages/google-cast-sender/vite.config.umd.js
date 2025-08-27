import { defineConfig } from 'vite';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import process from 'node:process';

const entryMap = {
  sender: {
    entry: 'src/google-cast-sender.js',
    output: 'google-cast-sender',
    outDir: 'dist',
    name: 'GoogleCastSender',
  },
  button: {
    entry: 'src/components/google-cast-button.js',
    output: 'google-cast-button',
    outDir: 'dist/button',
    name: 'GoogleCastButton',
  },
  launcher: {
    entry: 'src/components/google-cast-launcher.js',
    output: 'google-cast-launcher',
    outDir: 'dist/launcher',
    name: 'GoogleCastLauncher',
  },
};
const target = process.env.BUILD_TARGET;
const {
  entry,
  output,
  outDir,
  name
} = entryMap[target];

/**
 * Vite's configuration for the umd build.
 *
 * Outputs:
 * - 'dist/google-cast-sender.umd.min.js': Universal Module Definition version.
 */
export default defineConfig({
  esbuild: false,
  build: {
    outDir: outDir,
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      formats: ['umd'],
      name: name,
      entry: entry
    },
    rollupOptions: {
      output: {
        name: name,
        entryFileNames: `${output}.umd.min.js`,
        globals: {
          videojs: 'videojs',
        },
      },
      external: ['video.js'],
      plugins: [
        babel({
          babelHelpers: 'bundled',
          exclude: 'node_modules/**'
        }),
        terser()
      ],
    },
  },
});
