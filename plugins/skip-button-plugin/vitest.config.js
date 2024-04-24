import { defineProject } from 'vitest/config';
import path from 'path';

export default defineProject({
  test: {
    environment: 'jsdom',
    alias: [
      {
        find: /^@srgssr\/pillarbox-web$/,
        replacement: path.resolve(__dirname, '../../node_modules/@srgssr/pillarbox-web/dist/pillarbox.es.js')
      }
    ]
  }
});
