import { readFileSync } from 'node:fs';
import { extname } from 'node:path';
import { SassString } from 'sass';

const mimeTypes = {
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

/**
 * The Sass options shared by the stylesheet build and vite.
 *
 * Custom functions:
 * - `inline-asset($path)`: the file at `$path`, relative to this package, as
 *   a base64 data url, e.g. `src: inline-asset('assets/fonts/icons.woff')`.
 *
 * @see https://sass-lang.com/documentation/js-api/interfaces/options/#functions
 */
export default {
  loadPaths: ['node_modules', '../../node_modules'],
  functions: {
    'inline-asset($path)': ([path]) => {
      const file = new URL(path.assertString('path').text, import.meta.url);
      const type = mimeTypes[extname(file.pathname)];

      if (!type) {
        throw new Error(`inline-asset: unsupported file type ${file.pathname}`);
      }

      const data = readFileSync(file).toString('base64');

      return new SassString(`url("data:${type};base64,${data}")`, { quotes: false });
    }
  }
};
