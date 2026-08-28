import { readdirSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

const illustrationEntries = Object.fromEntries(
  readdirSync(fileURLToPath(new URL('./src/illustrations', import.meta.url)))
    .filter((fileName) => /^Illustration.+\.ts$/.test(fileName))
    .map((fileName) => [
      `illustrations/${fileName.replace(/\.ts$/, '')}`,
      fileURLToPath(new URL(`./src/illustrations/${fileName}`, import.meta.url)),
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
        'components/Illustration': fileURLToPath(
          new URL('./src/components/Illustration.ts', import.meta.url),
        ),
        ...illustrationEntries,
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
