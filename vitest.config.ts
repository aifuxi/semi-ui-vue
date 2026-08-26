import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue(), react()],
  resolve: {
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
