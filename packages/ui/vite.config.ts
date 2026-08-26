import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [vue(), dts({ include: ['src'] })],
  resolve: {
    dedupe: ['vue'],
  },
  build: {
    lib: {
      entry: {
        index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        'button/index': fileURLToPath(new URL('./src/button/index.ts', import.meta.url)),
        'divider/index': fileURLToPath(new URL('./src/divider/index.ts', import.meta.url)),
        'float-button/index': fileURLToPath(
          new URL('./src/float-button/index.ts', import.meta.url),
        ),
        'icon/index': fileURLToPath(new URL('./src/icon/index.ts', import.meta.url)),
        'layout/index': fileURLToPath(new URL('./src/layout/index.ts', import.meta.url)),
        'space/index': fileURLToPath(new URL('./src/space/index.ts', import.meta.url)),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', '@workspace/icons'],
    },
  },
});
