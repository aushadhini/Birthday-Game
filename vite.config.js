import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Served from https://aushadhini.github.io/Birthday-Game/ on GitHub Pages.
  base: process.env.DEPLOY_BASE ?? '/',
  plugins: [react(), tailwindcss()],
});
