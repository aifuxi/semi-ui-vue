import { defineConfig } from '@playwright/test';
import { PARITY_VIEWPORTS, VISUAL_THRESHOLDS } from './packages/test-infra/src';

// Full-suite benchmark on 2026-08-30: 3 workers was faster than 2/4/6/8 while
// keeping all 482 tests retry-free. Keep the two defaults explicit so future
// runner-specific tuning does not need to change the PARITY_WORKERS contract.
const DEFAULT_LOCAL_PARITY_WORKERS = 3;
const DEFAULT_CI_PARITY_WORKERS = 3;
const requestedWorkers = Number.parseInt(process.env.PARITY_WORKERS ?? '', 10);
const parityWorkers =
  Number.isSafeInteger(requestedWorkers) && requestedWorkers > 0
    ? requestedWorkers
    : process.env.CI
      ? DEFAULT_CI_PARITY_WORKERS
      : DEFAULT_LOCAL_PARITY_WORKERS;

export default defineConfig({
  testDir: './tests/browser',
  // Each component spec stays serial so its behavior and visual phases remain ordered.
  // Playwright can run independent component specs concurrently.
  fullyParallel: false,
  workers: parityWorkers,
  snapshotPathTemplate: '{testDir}/snapshots/{arg}{-projectName}{-snapshotSuffix}{ext}',
  forbidOnly: Boolean(process.env.CI),
  failOnFlakyTests: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  // Hosted macOS image updates change rasterization. Release CI still performs the
  // independent React/Vue pixel comparisons in each parity test.
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
      command: 'pnpm --filter @workspace/parity-vue dev --host 127.0.0.1',
      url: 'http://127.0.0.1:4174',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
