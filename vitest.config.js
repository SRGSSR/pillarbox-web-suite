import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json-summary', 'json'],
      reportOnFailure: true,
      clean: true,
      include: ['packages/**/src/**']
    }
  }
});
