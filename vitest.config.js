import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    exclude: [
      ...configDefaults.exclude,
      'scripts',
    ],
    coverage: {
      reporter: ['text', 'json-summary', 'json'],
      reportOnFailure: true,
      clean: true,
      include: ['packages/**/src/**']
    }
  }
});
