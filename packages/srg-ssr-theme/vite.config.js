import { defineConfig } from 'vite';
import sassOptions from './sass.config.js';

export default defineConfig({
  base: './',
  css: {
    preprocessorOptions: {
      scss: sassOptions
    }
  },
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
