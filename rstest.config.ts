import { fileURLToPath } from 'node:url';
import { defineConfig } from '@rstest/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import type { RsbuildPlugin } from '@rsbuild/core';
import { pinnedSourcePlugins } from './scripts/parity-rsbuild';
import { parityPrismOrder, parityWorkerEntry } from './scripts/parity-build-runtime.mjs';
import { adaptPinnedJsonViewerCore } from './packages/foundation-integration/vite-json-viewer-plugin';
import { generateVitestAliases } from './scripts/gen-vitest-aliases.mjs';

const aliases = await generateVitestAliases();
export default defineConfig({
  plugins: [
    pluginVue(),
    parityPrismOrder(),
    parityWorkerEntry(),
    {
      name: 'test-vue-ssr-environment',
      setup(api) {
        api.modifyBundlerChain((chain, { CHAIN_ID, environment }) => {
          // Rstest adds the browser condition for DOM environments. Node SSR tests
          // need server templates; plugin-vue otherwise forces client compilation.
          chain.module
            .rule(CHAIN_ID.RULE.VUE)
            .use(CHAIN_ID.USE.VUE)
            .tap((options) => ({
              ...(options as Record<string, unknown>),
              isServerBuild: !environment.config.resolve.conditionNames?.includes('browser'),
            }));
        });
      },
    } satisfies RsbuildPlugin,
    pinnedSourcePlugins(
      import.meta.dirname,
      [adaptPinnedJsonViewerCore()],
      [
        ...Object.entries(aliases).map(([find, replacement]) => ({ find, replacement })),
        {
          find: /^@aifuxi\/semi-ui-vue$/,
          replacement: fileURLToPath(new URL('./packages/ui/src/index.ts', import.meta.url)),
        },
        {
          find: /^@aifuxi\/semi-ui-vue\/([^/]+)$/,
          replacement: fileURLToPath(new URL('./packages/ui/src/$1/index.ts', import.meta.url)),
        },
      ],
      ['vue'],
    ),
  ],
  // Preserve the development checks exercised by the previous source-test setup.
  source: {
    include: [/vendor\/semi-design/],
    define: { 'import.meta.env.DEV': true, 'import.meta.env.PROD': false },
  },
  testEnvironment: 'jsdom',
  // Node tests also need the pinned aliases, Prism ordering and CJS named exports.
  // Externalizing dependencies bypasses these transforms and changes their semantics.
  output: { bundleDependencies: true },
  tools: {
    rspack: {
      // The Node compiler lazily loads optional template engines. Resolve Vue's
      // matching public compiler at runtime instead of bundling those unused engines.
      externals: { '@vue/compiler-sfc': 'commonjs vue/compiler-sfc' },
    },
  },
  include: [
    'scripts/**/*.{test,spec}.mjs',
    'packages/*/src/**/*.{test,spec}.ts',
    'apps/parity-vue/src/**/*.{test,spec}.ts',
    'apps/reference-react/src/**/*.{test,spec}.{ts,tsx}',
  ],
  exclude: ['vendor/**', '**/dist/**', 'tests/browser/**'],
  coverage: {
    provider: 'v8',
    include: ['packages/*/src/**/*.{ts,tsx,vue}'],
    exclude: ['vendor/**', '**/dist/**', '**/*.d.ts', '**/*.{test,spec}.{ts,tsx}'],
    ...(process.env.COVERAGE_ALL === '1' ? {} : { changed: 'origin/master' }),
  },
});
