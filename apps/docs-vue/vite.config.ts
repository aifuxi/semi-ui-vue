import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { compilePinnedComponentStyles } from '../../packages/theme-default/vite-plugin.ts';

export default defineConfig({
  plugins: [compilePinnedComponentStyles(), vue()],
  resolve: {
    alias: [
      {
        find: '@workspace/ui',
        replacement: fileURLToPath(new URL('../../packages/ui/src/index.ts', import.meta.url)),
      },
    ],
    dedupe: ['vue'],
  },
  server: {
    port: 4174,
    strictPort: true,
  },
});
