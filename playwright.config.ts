import { fileURLToPath } from 'node:url';
import { defineConfig } from '@playwright/test';
import { PARITY_VIEWPORTS, VISUAL_THRESHOLDS } from './packages/test-infra/src';

const dev = process.env.PARITY_SERVER_MODE === 'dev';
if (process.env.PARITY_SERVER_MODE && !['dev', 'build'].includes(process.env.PARITY_SERVER_MODE)) {
  throw new Error('PARITY_SERVER_MODE must be dev or build');
}
const workers = Number(process.env.PARITY_WORKERS ?? 3);
if (!Number.isSafeInteger(workers) || workers < 1)
  throw new Error('PARITY_WORKERS must be positive');

export default defineConfig({
  testDir: './tests/browser',
  outputDir: 'test-results/components',
  fullyParallel: false,
  workers,
  snapshotPathTemplate: '{testDir}/snapshots/{arg}{-projectName}{-snapshotSuffix}{ext}',
  forbidOnly: true,
  failOnFlakyTests: true,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report/components' }]],
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      scale: 'css',
      threshold: VISUAL_THRESHOLDS.screenshotThreshold,
      maxDiffPixelRatio: VISUAL_THRESHOLDS.maxDiffPixelRatio,
    },
  },
  use: {
    channel: 'chromium',
    headless: true,
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
    viewport: { width: PARITY_VIEWPORTS.desktop.width, height: PARITY_VIEWPORTS.desktop.height },
    deviceScaleFactor: PARITY_VIEWPORTS.desktop.deviceScaleFactor,
    colorScheme: 'light',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  webServer: [
    {
      cwd: fileURLToPath(new URL('./apps/reference-react', import.meta.url)),
      command: dev
        ? 'pnpm dev --host 127.0.0.1'
        : 'pnpm build && pnpm exec rsbuild preview --host 127.0.0.1 --port 4173',
      url: 'http://127.0.0.1:4173',
      stdout: 'pipe',
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      cwd: fileURLToPath(new URL('./apps/storybook-vue', import.meta.url)),
      command: dev
        ? 'pnpm dev'
        : 'pnpm build && pnpm exec vite preview --host 127.0.0.1 --port 4174 --strictPort',
      url: 'http://127.0.0.1:4174/iframe.html',
      stdout: 'pipe',
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
