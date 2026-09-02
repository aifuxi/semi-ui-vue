import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { compilePinnedComponentStyles } from '../../packages/theme-default/vite-plugin.ts';
import { adaptPinnedJsonViewerCore } from '../../packages/foundation-integration/vite-json-viewer-plugin.js';

export default defineConfig({
  plugins: [adaptPinnedJsonViewerCore(), compilePinnedComponentStyles(), vue()],
  resolve: {
    alias: [
      {
        find: /^@aifuxi\/semi-ui-vue\/locale\/source\/(.+)$/,
        replacement: fileURLToPath(
          new URL('../../packages/ui/src/locale/source/$1.ts', import.meta.url),
        ),
      },
      {
        find: '@aifuxi/semi-ui-vue',
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
        find: '@aifuxi/semi-icons-vue',
        replacement: fileURLToPath(new URL('../../packages/icons/src/index.ts', import.meta.url)),
      },
      {
        find: '@aifuxi/semi-icons-lab-vue',
        replacement: fileURLToPath(
          new URL('../../packages/icons-lab/src/index.ts', import.meta.url),
        ),
      },
      {
        find: '@aifuxi/semi-illustrations-vue',
        replacement: fileURLToPath(
          new URL('../../packages/illustrations/src/index.ts', import.meta.url),
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
