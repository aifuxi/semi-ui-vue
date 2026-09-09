import { defineConfig } from '@playwright/test';

const docsPort = Number(process.env.DOCS_PORT ?? 4321);
const docsOrigin = `http://127.0.0.1:${docsPort}`;

export default defineConfig({
  testDir: './tests/nuxt',
  fullyParallel: false,
  workers: 1,
  retries: 2,
  forbidOnly: Boolean(process.env.CI),
  failOnFlakyTests: Boolean(process.env.CI),
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: docsOrigin,
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
      env: { PORT: String(docsPort) },
      url: `${docsOrigin}/zh-cn/start/introduction/`,
      reuseExistingServer: !process.env.CI && !process.env.DOCS_ACCEPTANCE,
      timeout: 120_000,
    },
    {
      command: 'pnpm --filter @workspace/reference-react dev --host 127.0.0.1',
      url: 'http://127.0.0.1:4173/docs.html',
      reuseExistingServer: !process.env.CI && !process.env.DOCS_ACCEPTANCE,
      timeout: 120_000,
    },
  ],
});
