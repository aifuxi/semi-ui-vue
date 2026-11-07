import { defineConfig } from '@playwright/test';

/** 独立生产预览端口，避开用户已有的文档站和工作台开发服务。 */
const port = 4324;

export default defineConfig({
  testDir: './tests/theme-studio',
  outputDir: 'test-results/theme-studio',
  fullyParallel: true,
  workers: 3,
  forbidOnly: true,
  failOnFlakyTests: true,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report/theme-studio' }]],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    channel: 'chromium',
    headless: true,
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
    viewport: { width: 1440, height: 1000 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: {
    command: `pnpm --filter @workspace/theme-studio build && pnpm --filter @workspace/theme-studio exec vite preview --host 127.0.0.1 --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}`,
    stdout: 'pipe',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
