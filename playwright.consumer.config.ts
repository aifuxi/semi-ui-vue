import { defineConfig } from '@playwright/test';
import components from './playwright.config';

export default defineConfig({
  ...components,
  testDir: './tests/consumer',
  outputDir: 'test-results/consumer',
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report/consumer' }]],
  projects: [{ name: 'consumer', use: { browserName: 'chromium' } }],
  webServer: [],
});
