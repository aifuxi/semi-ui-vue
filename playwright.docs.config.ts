import { fileURLToPath } from 'node:url';
import { defineConfig } from '@playwright/test';

const port = Number(process.env.DOCS_TEST_PORT ?? '4321');

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
    baseURL: `http://127.0.0.1:${port}`,
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
    command: `pnpm build && pnpm exec vitepress preview . --port ${port} --host 127.0.0.1`,
    url: `http://127.0.0.1:${port}`,
    stdout: 'pipe',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
