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

test('Tag 参考场景来自本地 v2.102.0 并保留关闭、Group 与 Split 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'tag',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.tagPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'tag')).toBe(true);
  await expect(page.locator('[data-parity-target="tag-basic"] .semi-tag')).toHaveCount(3);
  await expect(page.locator('[data-parity-target="tag-group"] .semi-tag')).toHaveCount(3);
  await expect(page.locator('[data-parity-target="tag-group"] .semi-tag').last()).toHaveText('+2');
  await expect(page.locator('[data-parity-target="tag-split"] .semi-tag-first')).toHaveCount(1);
  await expect(page.locator('[data-parity-target="tag-split"] .semi-tag-last')).toHaveCount(1);
  expect(runtimeErrors).toEqual([]);
});

test('Tag React/Vue computed style、几何、关闭与公开 DOM 一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'tag',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('tag').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'tag', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    const closable = page.locator('[data-parity-target="tag-basic"] .semi-tag').nth(1);
    await closable.locator('.semi-tag-close').click();
    await expect(closable).toHaveClass(/semi-tag-invisible/);
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Tag React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'tag',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const target of assertScenarioComparable('tag').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'tag', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('tag-reference');
      const vueTarget = pair.vue.page.getByTestId('tag-vue');
      await expect(reactTarget).toHaveScreenshot(`tag-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`tag-vue-${viewportName}-${theme}.png`);
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

test('Tag React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'tag',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('tag').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'tag', target.id));
  }
  const reactTarget = pair.react.page.getByTestId('tag-reference');
  const vueTarget = pair.vue.page.getByTestId('tag-vue');
  await expect(reactTarget).toHaveScreenshot('tag-reference-rtl.png');
  await expect(vueTarget).toHaveScreenshot('tag-vue-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
