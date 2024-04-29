import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

/**
 * Rollup build configurations for the Skip button Plugin.
 */
export default [
  /**
   * Rollup build configuration for the ESModule build.
   *
   * Outputs:
   * - 'dist/skip-button.es.min.js': Minified ESModule version with sourcemaps.
   * - 'dist/skip-button.es.js': Non-minified ESModule.
   *
   * @example
   * ```javascript
   * import '@srgssr/skip-button'
   * ```
   */
  {
    input: 'src/skip-button.js',
    output: [
      {
        file: 'dist/skip-button.es.min.js',
        format: 'es',
        sourcemap: true,
        plugins: [terser()],
      },
      {
        file: 'dist/skip-button.es.js',
        format: 'es',
        plugins: [filesize()]
      }
    ],
    external: ['@srgssr/pillarbox-web'],
    plugins: [json(), resolve(), babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    })]
  },
  /**
   * Rollup build configuration for the CJS build.
   *
   * Outputs:
   * - 'dist/skip-button.cjs.min.js': Minified UMD version with sourcemaps.
   * - 'dist/skip-button.cjs.js': Non-minified UMD.
   *
   * @example
   * ```html
   * <script src="skip-button.cjs.min.js"></script>
   * ```
   *
   * @type {import('rollup').RollupOptions}
   */
  {
    input: 'src/skip-button.js',
    output: [
      {
        name: 'SkipButtonPlugin',
        file: 'dist/skip-button.cjs.min.js',
        format: 'cjs',
        sourcemap: true,
        globals: {
          '@srgssr/pillarbox-web': 'pillarbox'
        },
        plugins: [terser()]
      },
      {
        name: 'SkipButtonPlugin',
        file: 'dist/skip-button.cjs.js',
        format: 'cjs',
        globals: {
          '@srgssr/pillarbox-web': 'pillarbox'
        },
        plugins: [filesize()]
      }
    ],
    external: ['@srgssr/pillarbox-web'],
    plugins: [commonjs(), json(), resolve(), babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    })]
  }
];
