import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';

export default tseslint.config(
  {
    ignores: [
      'vendor/**',
      '.agents/**',
      '.codex/**',
      '**/dist/**',
      '**/node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,tsx,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/singleline-html-element-content-newline': 'off',
    },
  },
  {
    files: [
      '*.{js,mjs,cjs,ts,mts,cts}',
      'scripts/**/*.{js,mjs,cjs,ts,mts,cts}',
      'tests/**/*.{js,mjs,cjs,ts,mts,cts}',
      '**/*.config.{js,mjs,cjs,ts,mts,cts}',
    ],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['apps/*/src/**/*.{js,ts,tsx,vue}'],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['{apps,packages}/*/src/**/*.{test,spec}.{js,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['apps/reference-react/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
  {
    files: [
      'apps/docs-vue/src/**/*.{ts,vue}',
      'packages/ui/src/**/*.{ts,vue}',
      'packages/icons/src/**/*.{ts,vue}',
      'packages/icons-lab/src/**/*.{ts,vue}',
      'packages/illustrations/src/**/*.{ts,vue}',
      'packages/test-infra/src/**/*.{ts,vue}',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '**/vendor/semi-design/**',
                'vendor/semi-design/**',
                '**/foundation-integration/**',
              ],
              message: '运行时源码不得绕过已定义的上游集成或资产生成边界。',
            },
            {
              group: ['@douyinfe/*', '@douyinfe/**'],
              message: 'Vue 运行时源码不得直接依赖上游 React 包。',
            },
          ],
        },
      ],
    },
  },
  eslintConfigPrettier,
);
