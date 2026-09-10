import { defineConfig } from '@playwright/test';

const port = Number(process.env.DOCS_DEV_PORT ?? 4332);
const origin = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests/nuxt-dev',
  workers: 1,
  retries: 0,
  forbidOnly: Boolean(process.env.CI),
  timeout: 180_000,
  use: {
    baseURL: origin,
    browserName: 'chromium',
    locale: 'en-US',
    timezoneId: 'Asia/Shanghai',
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `pnpm exec nuxt dev --port ${port} --host 127.0.0.1`,
    url: `${origin}/en-us/start/getting-started/`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
