import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    allowedHosts: ['www.localhost.com']
  },
  build: {
    outDir: 'dist/demo'
  },
  test: {
    environment: 'jsdom'
  }
});
