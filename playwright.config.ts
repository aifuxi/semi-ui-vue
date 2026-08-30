import { defineConfig } from '@playwright/test';
import { PARITY_VIEWPORTS, VISUAL_THRESHOLDS } from './packages/test-infra/src';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  failOnFlakyTests: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  // Hosted macOS image updates change rasterization. Release CI still performs the
  // independent React/Vue byte comparisons in each parity test.
  ignoreSnapshots: process.env.PARITY_IGNORE_HOST_BASELINES === '1',
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      scale: 'css',
      threshold: VISUAL_THRESHOLDS.screenshotThreshold,
      maxDiffPixelRatio: VISUAL_THRESHOLDS.maxDiffPixelRatio,
    },
  },
  use: {
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
    viewport: {
      width: PARITY_VIEWPORTS.desktop.width,
      height: PARITY_VIEWPORTS.desktop.height,
    },
    deviceScaleFactor: PARITY_VIEWPORTS.desktop.deviceScaleFactor,
    colorScheme: 'light',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: [
    {
      command: 'pnpm --filter @workspace/reference-react dev --host 127.0.0.1',
      url: 'http://127.0.0.1:4173',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'pnpm --filter @workspace/docs-vue dev --host 127.0.0.1',
      url: 'http://127.0.0.1:4174',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
