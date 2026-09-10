import { parityBuildProvenance } from '../../scripts/parity-build-provenance.mjs';
import { parityPrismOrder, parityWorkerEntry } from '../../scripts/parity-build-runtime.mjs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import { pinnedSourcePlugins } from '../../scripts/parity-rsbuild.js';
import { compilePinnedComponentStyles } from '../../packages/theme-default/vite-plugin.ts';
import { adaptPinnedJsonViewerCore } from '../../packages/foundation-integration/vite-json-viewer-plugin.js';

export default defineConfig({
  plugins: [
    parityBuildProvenance(fileURLToPath(new URL('../..', import.meta.url))),
    parityPrismOrder(),
    parityWorkerEntry(),
    pluginVue(),
    pinnedSourcePlugins(
      fileURLToPath(new URL('.', import.meta.url)),
      [adaptPinnedJsonViewerCore(), compilePinnedComponentStyles()],
      [
        {
          find: /^@aifuxi\/semi-ui-vue\/locale\/source\/(.+)$/,
          replacement: fileURLToPath(
            new URL('../../packages/ui/src/locale/source/$1.ts', import.meta.url),
          ),
        },
        {
          find: /^@aifuxi\/semi-ui-vue\/([^/]+)$/,
          replacement: fileURLToPath(new URL('../../packages/ui/src/$1/index.ts', import.meta.url)),
        },
        {
          find: /^@aifuxi\/semi-ui-vue$/,
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
      ['vue'],
    ),
  ],
  source: { entry: { index: './src/main.ts' }, include: [/vendor\/semi-design/] },
  html: { template: './index.html' },
  server: { port: 4174, strictPort: true },
  output: { distPath: { root: 'dist' } },
});
