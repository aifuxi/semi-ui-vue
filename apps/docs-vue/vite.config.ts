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
      {
        find: '@douyinfe/semi-animation',
        replacement: fileURLToPath(
          new URL('../../vendor/semi-design/packages/semi-animation/index.ts', import.meta.url),
        ),
      },
      {
        find: 'bezier-easing',
        replacement: fileURLToPath(
          new URL('../../packages/ui/node_modules/bezier-easing/src/index.js', import.meta.url),
        ),
      },
      {
        find: /^fast-copy$/,
        replacement: fileURLToPath(
          new URL('../../packages/foundation-integration/src/fast-copy.js', import.meta.url),
        ),
      },
      {
        find: /^async-validator$/,
        replacement: fileURLToPath(
          new URL(
            '../../packages/ui/node_modules/async-validator/dist-web/index.js',
            import.meta.url,
          ),
        ),
      },
      {
        find: '@workspace/icons',
        replacement: fileURLToPath(new URL('../../packages/icons/src/index.ts', import.meta.url)),
      },
      {
        find: '@workspace/icons-lab',
        replacement: fileURLToPath(
          new URL('../../packages/icons-lab/src/index.ts', import.meta.url),
        ),
      },
    ],
    dedupe: ['vue'],
  },
  server: {
    port: 4174,
    strictPort: true,
  },
});
