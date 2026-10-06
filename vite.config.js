import { defineConfig } from 'vite';
import sassOptions from './packages/srg-ssr-theme/sass.config.js';

/**
 * Vite configuration file.
 *
 * @see https://vitejs.dev/config/
 */
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
});
