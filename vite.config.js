import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensures relative assets in production builds for GitHub Pages
  server: {
    port: 3000,
    open: false,
    host: true
  }
});
