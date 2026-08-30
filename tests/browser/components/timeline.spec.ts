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

test('Timeline 参考场景来自本地 v2.102.0 并保留类型、布局与点击契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'timeline',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.timelinePublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'timeline')).toBe(true);
  await expect(page.locator('[data-parity-target="timeline-basic"] > li')).toHaveCount(4);
  await expect(page.locator('[data-parity-target="timeline-center"] > li')).toHaveCount(3);
  await expect(page.locator('.semi-timeline-item-head-success')).toHaveCount(2);
  await expect(
    page.locator('[data-parity-target="timeline-center"] .semi-timeline-item-right'),
  ).toHaveCount(1);
  await page.locator('[data-parity-target="timeline-success"]').click();
  await expect(page.getByRole('status')).toHaveText('最近操作：创建服务现场');
  expect(runtimeErrors).toEqual([]);
});

test('Timeline React/Vue computed style、几何、ARIA 与公开 DOM 一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'timeline',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('timeline').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'timeline', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(page.getByRole('list', { name: '处理进度' })).toBeVisible();
    await expect(page.getByRole('list', { name: '发布过程' })).toBeVisible();
    await expect(page.locator('.semi-timeline-item-tail[aria-hidden="true"]')).toHaveCount(7);
    await expect(page.locator('.semi-timeline-item-head[aria-hidden="true"]')).toHaveCount(7);
    await page.locator('[data-parity-target="timeline-success"]').click();
    await expect(page.getByRole('status')).toHaveText('最近操作：创建服务现场');
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Timeline React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'timeline',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const target of assertScenarioComparable('timeline').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'timeline', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('timeline-reference');
      const vueTarget = pair.vue.page.getByTestId('timeline-vue');
      await expect(reactTarget).toHaveScreenshot(`timeline-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`timeline-vue-${viewportName}-${theme}.png`);
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

test('Timeline React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'timeline',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('timeline').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'timeline', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(page.locator('[data-parity-target="timeline-basic"]')).toHaveCSS(
      'direction',
      'rtl',
    );
  }
  const reactTarget = pair.react.page.getByTestId('timeline-reference');
  const vueTarget = pair.vue.page.getByTestId('timeline-vue');
  await expect(reactTarget).toHaveScreenshot('timeline-reference-rtl.png');
  await expect(vueTarget).toHaveScreenshot('timeline-vue-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
