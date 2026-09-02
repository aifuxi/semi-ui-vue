import { expect, test } from '@playwright/test';
import {
  assertScenarioComparable,
  PARITY_VIEWPORTS,
  REFERENCE_BASELINE,
} from '../../packages/test-infra/src';
import { expectComparableTarget, openParityPages } from './parity-harness';

test('React 与 Vue 工作台在同一 Chromium 上下文中可用', async ({ context }) => {
  assertScenarioComparable('harness-calibration');
  const pair = await openParityPages(context, {
    scenarioId: 'harness-calibration',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  await Promise.all([
    expect(pair.react.page.getByText(REFERENCE_BASELINE.tag, { exact: true })).toBeVisible(),
    expect(pair.vue.page.getByText(REFERENCE_BASELINE.tag, { exact: true })).toBeVisible(),
    expect(pair.react.page).toHaveTitle(/工作台/),
    expect(pair.vue.page).toHaveTitle(/工作台/),
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

test('React 与 Vue 工作台保留窄视口专项入口', async ({ context }) => {
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
