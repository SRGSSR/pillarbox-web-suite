import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import babel from '@rollup/plugin-babel';

/**
 * Rollup build configurations for the Skip button Plugin.
 */
export default [
  /**
   * Rollup build configuration for the ESModule build.
   *
   * Outputs:
   * - 'dist/skip-button-plugin.es.min.js': Minified ESModule version with sourcemaps.
   * - 'dist/skip-button-plugin.es.js': Non-minified ESModule.
   *
   * @example
   * ```javascript
   * import '@srgssr/skip-button-plugin'
   * ```
   */
  {
    input: 'src/skip-button-plugin.js',
    output: [
      {
        file: 'dist/skip-button-plugin.es.min.js',
        format: 'es',
        sourcemap: true,
        plugins: [terser()],
      },
      {
        file: 'dist/skip-button-plugin.es.js',
        format: 'es',
        plugins: [filesize()]
      }
    ],
    external: ['@srgssr/pillarbox-web'],
    plugins: [resolve(), babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    })]
  },
  /**
   * Rollup build configuration for the CJS build.
   *
   * Outputs:
   * - 'dist/skip-button-plugin.cjs.min.js': Minified UMD version with sourcemaps.
   * - 'dist/skip-button-plugin.cjs.js': Non-minified UMD.
   *
   * @example
   * ```html
   * <script src="skip-button-plugin.cjs.min.js"></script>
   * ```
   *
   * @type {import('rollup').RollupOptions}
   */
  {
    input: 'src/skip-button-plugin.js',
    output: [
      {
        name: 'SkipButtonPlugin',
        file: 'dist/skip-button-plugin.cjs.min.js',
        format: 'cjs',
        sourcemap: true,
        globals: {
          '@srgssr/pillarbox-web': 'pillarbox'
        },
        plugins: [terser()]
      },
      {
        name: 'SkipButtonPlugin',
        file: 'dist/skip-button-plugin.cjs.js',
        format: 'cjs',
        globals: {
          '@srgssr/pillarbox-web': 'pillarbox'
        },
        plugins: [filesize()]
      }
    ],
    external: ['@srgssr/pillarbox-web'],
    plugins: [commonjs(), resolve(), babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    })]
  }
];
