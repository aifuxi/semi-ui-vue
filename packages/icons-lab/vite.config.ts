import { readdirSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

const iconEntries = Object.fromEntries(
  readdirSync(fileURLToPath(new URL('./src/icons', import.meta.url)))
    .filter((fileName) => /^Icon.+\.ts$/.test(fileName))
    .map((fileName) => [
      `icons/${fileName.replace(/\.ts$/, '')}`,
      fileURLToPath(new URL(`./src/icons/${fileName}`, import.meta.url)),
    ]),
);

export default defineConfig({
  plugins: [vue(), dts({ include: ['src'] })],
  resolve: {
    dedupe: ['vue'],
  },
  build: {
    lib: {
      entry: {
        index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        'components/Icon': fileURLToPath(new URL('./src/components/Icon.ts', import.meta.url)),
        ...iconEntries,
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});
