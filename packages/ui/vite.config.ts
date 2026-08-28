import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({ include: ['src'] }),
    {
      name: 'strip-private-source-region-paths',
      renderChunk(code) {
        return {
          code: code.replace(
            /\/\/#region [^\n]*vendor\/semi-design[^\n]*\n/g,
            '//#region bundled-foundation\n',
          ),
          map: null,
        };
      },
    },
  ],
  resolve: {
    alias: [
      {
        find: /^lodash$/,
        replacement: fileURLToPath(
          new URL('../foundation-integration/src/resizable-lodash.js', import.meta.url),
        ),
      },
    ],
    dedupe: ['vue'],
  },
  build: {
    lib: {
      entry: {
        index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        'auto-complete/index': fileURLToPath(
          new URL('./src/auto-complete/index.ts', import.meta.url),
        ),
        'button/index': fileURLToPath(new URL('./src/button/index.ts', import.meta.url)),
        'checkbox/index': fileURLToPath(new URL('./src/checkbox/index.ts', import.meta.url)),
        'config-provider/index': fileURLToPath(
          new URL('./src/config-provider/index.ts', import.meta.url),
        ),
        'divider/index': fileURLToPath(new URL('./src/divider/index.ts', import.meta.url)),
        'float-button/index': fileURLToPath(
          new URL('./src/float-button/index.ts', import.meta.url),
        ),
        'grid/index': fileURLToPath(new URL('./src/grid/index.ts', import.meta.url)),
        'icon/index': fileURLToPath(new URL('./src/icon/index.ts', import.meta.url)),
        'input/index': fileURLToPath(new URL('./src/input/index.ts', import.meta.url)),
        'input-number/index': fileURLToPath(
          new URL('./src/input-number/index.ts', import.meta.url),
        ),
        'layout/index': fileURLToPath(new URL('./src/layout/index.ts', import.meta.url)),
        'pin-code/index': fileURLToPath(new URL('./src/pin-code/index.ts', import.meta.url)),
        'radio/index': fileURLToPath(new URL('./src/radio/index.ts', import.meta.url)),
        'rating/index': fileURLToPath(new URL('./src/rating/index.ts', import.meta.url)),
        'resizable/index': fileURLToPath(new URL('./src/resizable/index.ts', import.meta.url)),
        'select/index': fileURLToPath(new URL('./src/select/index.ts', import.meta.url)),
        'slider/index': fileURLToPath(new URL('./src/slider/index.ts', import.meta.url)),
        'space/index': fileURLToPath(new URL('./src/space/index.ts', import.meta.url)),
        'switch/index': fileURLToPath(new URL('./src/switch/index.ts', import.meta.url)),
        'tag-input/index': fileURLToPath(new URL('./src/tag-input/index.ts', import.meta.url)),
        'tooltip/index': fileURLToPath(new URL('./src/tooltip/index.ts', import.meta.url)),
        'typography/index': fileURLToPath(new URL('./src/typography/index.ts', import.meta.url)),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', '@workspace/icons'],
    },
  },
});
