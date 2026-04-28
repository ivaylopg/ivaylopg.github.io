import { defineConfig } from 'astro/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://ivaylogetov.com',
  server: {
    host: true
  },
  compressHTML: false,
  markdown: {
    smartypants: false
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // Mirrors Jekyll's sass load_paths: _sass/
          // Allows @import "lib/bourbon/bourbon" etc. to resolve from src/styles/
          loadPaths: [path.resolve(__dirname, 'src/styles')],
        },
      },
    },
  },
});
