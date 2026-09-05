import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/nuxt',
  fullyParallel: false,
  workers: 1,
  retries: 2,
  forbidOnly: Boolean(process.env.CI),
  failOnFlakyTests: Boolean(process.env.CI),
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: 'http://127.0.0.1:4321',
    browserName: 'chromium',
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
    colorScheme: 'light',
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'node scripts/preview-static.mjs',
      url: 'http://127.0.0.1:4321/zh-cn/start/introduction/',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'pnpm --filter @workspace/reference-react dev --host 127.0.0.1',
      url: 'http://127.0.0.1:4173/docs.html',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
