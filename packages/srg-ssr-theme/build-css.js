/**
 * Compiles the theme stylesheet, like the sass CLI with `--style compressed
 * --source-map`, but through the JS API to provide the custom functions of
 * `sass.config.js`.
 *
 * Outputs:
 * - 'dist/srg-ssr-theme.min.css': the compressed stylesheet.
 * - 'dist/srg-ssr-theme.min.css.map': its source map.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compile } from 'sass';
import sassOptions from './sass.config.js';

const input = 'scss/srg-ssr-theme.scss';
const output = 'dist/srg-ssr-theme.min.css';

const { css, sourceMap } = compile(input, {
  ...sassOptions,
  style: 'compressed',
  sourceMap: true
});

sourceMap.file = basename(output);
sourceMap.sources = sourceMap.sources.map((source) => source.startsWith('file:')
  ? relative(dirname(output), fileURLToPath(source))
  : source);

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${css}/*# sourceMappingURL=${basename(output)}.map */\n`);
writeFileSync(`${output}.map`, JSON.stringify(sourceMap));
