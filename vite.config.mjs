import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const projectDirectory = dirname(fileURLToPath(import.meta.url));
const base =
  process.env.GITHUB_ACTIONS === 'true'
    ? '/wdd330-sleepoutside-team14/'
    : '/';

export default defineConfig({
  base,
  root: 'src/',

  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(projectDirectory, 'src/index.html'),
        cart: resolve(projectDirectory, 'src/cart/index.html'),
        checkout: resolve(projectDirectory, 'src/checkout/index.html'),
        product: resolve(projectDirectory, 'src/product_pages/index.html'),
      },
    },
  },
});