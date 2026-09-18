import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/vue3-vite';
import vue from '@vitejs/plugin-vue';
import { mergeConfig } from 'vite';
import { compilePinnedComponentStyles } from '../../../packages/theme-default/vite-plugin.ts';
import {
  adaptPinnedJsonViewerCore,
  preservePinnedJsonViewerWorker,
} from '../../../packages/foundation-integration/vite-json-viewer-plugin.ts';
import { pinnedPrismPlugin } from '../../../packages/foundation-integration/vite-prism-plugin.ts';
import { storybookProvenance } from '../../../scripts/storybook-provenance.ts';

const workspaceRoot = fileURLToPath(new URL('../../..', import.meta.url));
const fromRoot = (relativePath: string) => path.join(workspaceRoot, relativePath);

const config: StorybookConfig = {
  stories: ['../src/stories/*.stories.ts'],
  framework: { name: '@storybook/vue3-vite', options: { docgen: false } },
  core: { disableTelemetry: true },
  async viteFinal(current) {
    return mergeConfig(current, {
      plugins: [
        vue(),
        adaptPinnedJsonViewerCore(),
        compilePinnedComponentStyles(),
        pinnedPrismPlugin(),
        storybookProvenance(workspaceRoot),
      ],
      resolve: {
        dedupe: ['vue'],
        alias: [
          {
            find: /^@aifuxi\/semi-ui-vue\/locale\/source\/(.+)$/,
            replacement: fromRoot('packages/ui/src/locale/source/$1.ts'),
          },
          {
            find: /^@aifuxi\/semi-ui-vue\/([^/]+)$/,
            replacement: fromRoot('packages/ui/src/$1/index.ts'),
          },
          {
            find: '@aifuxi/semi-icons-vue',
            replacement: fromRoot('packages/icons/src/index.ts'),
          },
          {
            find: '@aifuxi/semi-icons-lab-vue',
            replacement: fromRoot('packages/icons-lab/src/index.ts'),
          },
          {
            find: '@aifuxi/semi-illustrations-vue',
            replacement: fromRoot('packages/illustrations/src/index.ts'),
          },
          {
            find: '@douyinfe/semi-animation',
            replacement: fromRoot('vendor/semi-design/packages/semi-animation/index.ts'),
          },
          {
            find: /^bezier-easing$/,
            replacement: fromRoot('packages/ui/node_modules/bezier-easing/src/index.js'),
          },
          {
            find: /^fast-copy$/,
            replacement: fromRoot('packages/foundation-integration/src/fast-copy.js'),
          },
          {
            find: /^async-validator$/,
            replacement: fromRoot('packages/ui/node_modules/async-validator/dist-web/index.js'),
          },
        ],
      },
      worker: { plugins: () => [preservePinnedJsonViewerWorker()] },
      server: { fs: { allow: [workspaceRoot] } },
      build: { cssMinify: false },
    });
  },
};

export default config;
