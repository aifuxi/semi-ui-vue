import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';
import type { Plugin } from 'vite';
import { adaptPinnedJsonViewerCore } from './packages/foundation-integration/vite-json-viewer-plugin.js';
import { generateVitestAliases } from './scripts/gen-vitest-aliases.mjs';
import { loadCoverageExemptions } from './scripts/verify-coverage-exemptions.mjs';

function resolveSemiUiVueComponentSubpaths(): Plugin {
  return {
    name: 'resolve-semi-ui-vue-component-subpaths',
    enforce: 'pre',
    resolveId(source) {
      if (source === '@aifuxi/semi-ui-vue') {
        return fileURLToPath(new URL('./packages/ui/src/index.ts', import.meta.url));
      }
      const component = source.match(/^@aifuxi\/semi-ui-vue\/([^/]+)$/)?.[1];
      return component
        ? fileURLToPath(new URL(`./packages/ui/src/${component}/index.ts`, import.meta.url))
        : null;
    },
  };
}

const [aliases, coverageExemptions] = await Promise.all([
  generateVitestAliases(),
  loadCoverageExemptions(),
]);
const fullCoverageReport = process.env.COVERAGE_ALL === '1';

export default defineConfig({
  plugins: [resolveSemiUiVueComponentSubpaths(), adaptPinnedJsonViewerCore(), vue(), react()],
  resolve: {
    alias: aliases,
    dedupe: ['vue'],
  },
  test: {
    environment: 'jsdom',
    include: [
      'scripts/**/*.{test,spec}.mjs',
      'packages/*/src/**/*.{test,spec}.ts',
      'apps/parity-vue/src/**/*.{test,spec}.ts',
      'apps/docs/src/**/*.{test,spec}.ts',
      'apps/reference-react/src/**/*.{test,spec}.{ts,tsx}',
    ],
    exclude: ['vendor/**', '**/dist/**', 'tests/browser/**'],
    coverage: {
      provider: 'v8',
      include: ['packages/*/src/**/*.{ts,tsx,vue}'],
      exclude: [
        'vendor/**',
        '**/dist/**',
        '**/*.d.ts',
        '**/*.{test,spec}.{ts,tsx}',
        ...coverageExemptions,
      ],
      ...(fullCoverageReport
        ? {}
        : {
            changed: 'origin/master',
            thresholds: {
              perFile: true,
              statements: 100,
              branches: 100,
              functions: 100,
              lines: 100,
            },
          }),
    },
  },
});
