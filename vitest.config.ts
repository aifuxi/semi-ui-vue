import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue(), react()],
  resolve: {
    alias: {
      '@workspace/ui': fileURLToPath(new URL('./packages/ui/src/index.ts', import.meta.url)),
      '@semi-v2.102.0/button-group': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiButtonGroupStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/split-button-group': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiSplitButtonGroupStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/button': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiButtonStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/divider': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiDividerStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/icon': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiIconStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/icons': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiIconsStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/icons-lab': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiIconsLabStub.tsx', import.meta.url),
      ),
    },
    dedupe: ['vue'],
  },
  test: {
    environment: 'jsdom',
    include: [
      'packages/*/src/**/*.{test,spec}.ts',
      'apps/docs-vue/src/**/*.{test,spec}.ts',
      'apps/reference-react/src/**/*.{test,spec}.{ts,tsx}',
    ],
    exclude: ['vendor/**', '**/dist/**', 'tests/browser/**'],
    coverage: {
      provider: 'v8',
      exclude: ['vendor/**', '**/dist/**'],
    },
  },
});
