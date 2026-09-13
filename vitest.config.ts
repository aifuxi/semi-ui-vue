import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';
import {
  adaptPinnedJsonViewerCore,
  preservePinnedJsonViewerWorker,
} from './packages/foundation-integration/vite-json-viewer-plugin';
import { pinnedPrismPlugin } from './packages/foundation-integration/vite-prism-plugin';

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));
const nodeTests = [
  'scripts/**/*.{test,spec}.mjs',
  'packages/*/src/**/*.ssr.test.ts',
  'packages/test-infra/src/**/*.{test,spec}.ts',
  'packages/foundation-integration/src/**/*.{test,spec}.ts',
  'apps/reference-react/src/runtime/**/*.{test,spec}.ts',
];

export default defineConfig({
  plugins: [vue(), pinnedPrismPlugin(), adaptPinnedJsonViewerCore()],
  resolve: {
    dedupe: ['vue'],
    alias: [
      {
        find: /^@aifuxi\/semi-ui-vue\/locale\/source\/(.+)$/,
        replacement: fromRoot('./packages/ui/src/locale/source/$1.ts'),
      },
      { find: /^@aifuxi\/semi-ui-vue$/, replacement: fromRoot('./packages/ui/src/index.ts') },
      {
        find: /^@aifuxi\/semi-ui-vue\/([^/]+)$/,
        replacement: fromRoot('./packages/ui/src/$1/index.ts'),
      },
      { find: '@aifuxi/semi-icons-vue', replacement: fromRoot('./packages/icons/src/index.ts') },
      {
        find: '@aifuxi/semi-icons-lab-vue',
        replacement: fromRoot('./packages/icons-lab/src/index.ts'),
      },
      {
        find: '@aifuxi/semi-illustrations-vue',
        replacement: fromRoot('./packages/illustrations/src/index.ts'),
      },
      {
        find: '@douyinfe/semi-animation',
        replacement: fromRoot('./vendor/semi-design/packages/semi-animation/index.ts'),
      },
      {
        find: 'fast-copy',
        replacement: fromRoot('./packages/foundation-integration/src/fast-copy.js'),
      },
      { find: 'lottie-web', replacement: fromRoot('./packages/ui/src/test/lottieWeb.ts') },
    ],
  },
  worker: { plugins: () => [preservePinnedJsonViewerWorker()] },
  test: {
    maxWorkers: 3,
    projects: [
      {
        extends: true,
        test: {
          name: 'dom',
          environment: 'jsdom',
          setupFiles: ['./tests/unit/setup-dom.ts'],
          include: ['packages/*/src/**/*.{test,spec}.ts'],
          exclude: nodeTests,
        },
      },
      {
        extends: true,
        test: {
          name: 'node',
          environment: 'node',
          setupFiles: ['./tests/unit/setup-node.ts'],
          include: nodeTests,
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      include: ['packages/*/src/**/*.{ts,tsx,vue}'],
      exclude: [
        'vendor/**',
        '**/dist/**',
        '**/*.d.ts',
        '**/*.{test,spec}.{ts,tsx}',
        '**/src/test/**',
      ],
      ...(process.env.COVERAGE_ALL === '1' ? {} : { changed: 'origin/master' }),
    },
  },
});
