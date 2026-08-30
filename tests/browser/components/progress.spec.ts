import { expect, test } from '@playwright/test';
import {
  assertScenarioComparable,
  createParityScenarioUrl,
  PARITY_VIEWPORTS,
  REFERENCE_SOURCE_PATHS,
} from '../../../packages/test-infra/src';
import {
  expectComparableTarget,
  expectScreenshotPixelsToMatch,
  openParityPages,
  PARITY_APPLICATIONS,
  referenceSourceWasRequested,
} from '../parity-harness';

test('Progress 参考场景来自本地 v2.102.0 并保留 line/circle、颜色与 ARIA', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'progress',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.progressPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'progress')).toBe(true);
  const scenario = page.getByTestId('progress-reference');
  await expect(scenario.getByRole('progressbar')).toHaveCount(6);
  await expect(scenario.locator('.semi-progress-horizontal')).toHaveCount(2);
  await expect(scenario.locator('.semi-progress-vertical')).toHaveCount(1);
  await expect(scenario.locator('.semi-progress-circle')).toHaveCount(3);
  await expect(scenario.locator('.semi-progress-circle-ring')).toHaveCount(3);
  await expect(
    scenario.locator('[data-parity-target="progress-circle-small"] .semi-progress-circle-text'),
  ).toHaveCount(0);
  await expect(scenario.getByRole('progressbar', { name: 'Gradient progress' })).toHaveAttribute(
    'aria-valuenow',
    '51',
  );
  await expect(
    scenario.locator(
      '[data-parity-target="progress-circle-gradient"] .semi-progress-circle-ring-inner',
    ),
  ).toHaveCSS('stroke', 'rgba(128, 128, 128, 0.498)');
  expect(runtimeErrors).toEqual([]);
});

test('Progress React/Vue 样式、几何、颜色、ARIA 与默认数字动画一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'progress',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('progress').targets).toHaveLength(8);
  for (const target of assertScenarioComparable('progress').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'progress', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    const progress = page.locator('[data-parity-target="progress-line-default"]');
    await expect(progress).toHaveAttribute('aria-valuemin', '0');
    await expect(progress).toHaveAttribute('aria-valuemax', '100');
    await expect(progress).toHaveAttribute('aria-valuenow', '50');
    await expect(progress.locator('.semi-progress-line-text')).toHaveText('50%');
    await page
      .locator('.progress-scenario__motion-control')
      .evaluate((element) => (element as HTMLButtonElement).click());
    await expect(progress).toHaveAttribute('aria-valuenow', '80');
    await expect(progress.locator('.semi-progress-line-text')).not.toHaveText('80%');
    await expect(progress.locator('.semi-progress-line-text')).toHaveText('80%', {
      timeout: 1_000,
    });
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Progress React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(
        context,
        {
          scenarioId: 'progress',
          theme,
          direction: 'ltr',
          locale: 'zh-CN',
        },
        { width: viewport.width, height: viewport.height },
      );
      for (const target of assertScenarioComparable('progress').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'progress', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('progress-reference');
      const vueTarget = pair.vue.page.getByTestId('progress-vue');
      await expect(reactTarget).toHaveScreenshot(`progress-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`progress-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Progress React/Vue RTL 样式、几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'progress',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('progress').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'progress', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(
      page.locator('[data-parity-target="progress-line-info"] .semi-progress-line-text'),
    ).toHaveCSS('margin-left', '0px');
    await expect(
      page.locator('[data-parity-target="progress-line-info"] .semi-progress-line-text'),
    ).toHaveCSS('margin-right', '16px');
  }
  const reactTarget = pair.react.page.getByTestId('progress-reference');
  const vueTarget = pair.vue.page.getByTestId('progress-vue');
  await expect(reactTarget).toHaveScreenshot('progress-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('progress-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
