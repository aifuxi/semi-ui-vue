import { fileURLToPath } from 'node:url';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/docs',
  outputDir: 'test-results/docs',
  fullyParallel: true,
  workers: 3,
  forbidOnly: true,
  failOnFlakyTests: true,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report/docs' }]],
  use: {
    baseURL: 'http://127.0.0.1:4321',
    channel: 'chromium',
    headless: true,
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
    viewport: { width: 1440, height: 900 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: {
    cwd: fileURLToPath(new URL('./apps/docs', import.meta.url)),
    command: 'pnpm build && pnpm preview',
    url: 'http://127.0.0.1:4321',
    stdout: 'pipe',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
