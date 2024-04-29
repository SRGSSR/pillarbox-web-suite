import { defineProject } from 'vitest/config';
import path from 'path';

export default defineProject({
  test: {
    environment: 'jsdom'
  }
});
