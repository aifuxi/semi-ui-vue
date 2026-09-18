import { expect, test } from '@playwright/test';
import { assertScenarioComparable, PARITY_VIEWPORTS } from '../../packages/test-infra/src';
import {
  expectComparableTarget,
  createVueScenarioUrl,
  openParityPages,
  PARITY_APPLICATIONS,
  requestedSourcePaths,
} from './parity-harness';

test('React 参考场景与 Storybook 在同一 Chromium 上下文中可用', async ({ context }) => {
  assertScenarioComparable('harness-calibration');
  const pair = await openParityPages(context, {
    scenarioId: 'harness-calibration',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  await Promise.all([
    expect(pair.react.page.locator('[data-parity-framework="react"]')).toBeVisible(),
    expect(pair.vue.page).toHaveURL(/\/iframe\.html\?id=parity-harness-calibration--scenario/),
  ]);
  await expect(pair.react.page.getByTestId('visual-calibration')).toHaveScreenshot(
    'workspace-calibration-react.png',
  );
  await expect(pair.vue.page.getByTestId('visual-calibration')).toHaveScreenshot(
    'workspace-calibration-vue.png',
  );
  await expectComparableTarget(pair, 'harness-calibration', 'visual-calibration');
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('React 与 Storybook 保留窄视口专项入口', async ({ context }) => {
  const { width, height, deviceScaleFactor } = PARITY_VIEWPORTS.narrow;
  const pair = await openParityPages(context, {
    scenarioId: 'harness-calibration',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  await Promise.all([
    pair.react.page.setViewportSize({ width, height }),
    pair.vue.page.setViewportSize({ width, height }),
  ]);
  expect(await pair.react.page.evaluate(() => window.devicePixelRatio)).toBe(deviceScaleFactor);
  expect(await pair.vue.page.evaluate(() => window.devicePixelRatio)).toBe(deviceScaleFactor);
});

test('Storybook 只加载当前场景的公开组件子路径', async ({ page }) => {
  const requestedUrls: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));

  await page.goto(
    createVueScenarioUrl({
      scenarioId: 'divider',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('divider-vue')).toBeVisible();
  await page.waitForLoadState('networkidle');

  const requestedPaths = await requestedSourcePaths(requestedUrls, PARITY_APPLICATIONS.vue.baseUrl);
  expect(requestedPaths.some((path) => path.endsWith('packages/ui/src/divider/index.ts'))).toBe(
    true,
  );
  expect(requestedPaths.some((path) => path.endsWith('packages/ui/src/index.ts'))).toBe(false);
  expect(requestedUrls.length).toBeLessThanOrEqual(200);
});
