import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Vite מאחד את נכסי הפרונט: HTML רב-דפים, PostCSS+Tailwind, ESM, ואופטימיזציית production.
 * ללא CDN — הכל נשלף מ-node_modules ונארז ל-dist.
 */
export default defineConfig({
    root: '.',
    base: './',
    publicDir: 'public',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                terms: resolve(__dirname, 'terms.html'),
                privacy: resolve(__dirname, 'privacy.html'),
                accessibility: resolve(__dirname, 'accessibility.html'),
            },
        },
    },
});
