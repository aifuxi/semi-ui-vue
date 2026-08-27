import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue(), react()],
  resolve: {
    alias: {
      '@workspace/ui': fileURLToPath(new URL('./packages/ui/src/index.ts', import.meta.url)),
      '@semi-v2.102.0/auto-complete': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiAutoCompleteStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/button-group': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiButtonGroupStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/split-button-group': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiSplitButtonGroupStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/button': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiButtonStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/checkbox': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiCheckboxStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/config-provider': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiConfigProviderStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/divider': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiDividerStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/float-button': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiFloatButtonStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/float-button-group': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiFloatButtonGroupStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/icon': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiIconStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/input': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiInputStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/input-number': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiInputNumberStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/input-group': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiInputGroupStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/textarea': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiTextAreaStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/grid': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiGridStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/layout': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiLayoutStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/resizable': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiResizableStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/select': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiSelectStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/icons': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiIconsStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/icons-lab': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiIconsLabStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/space': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiSpaceStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/switch': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiSwitchStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/tooltip': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiTooltipStub.tsx', import.meta.url),
      ),
      '@semi-v2.102.0/typography': fileURLToPath(
        new URL('./apps/reference-react/src/test/SemiTypographyStub.tsx', import.meta.url),
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
