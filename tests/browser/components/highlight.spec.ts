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

test('Highlight 参考场景来自本地 v2.102.0 并保留匹配、正则与合并契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'highlight',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  expect(referenceSourceWasRequested(requestedUrls, 'highlight')).toBe(true);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.highlightPublicEntry,
  );
  const scenario = page.getByTestId('highlight-reference');
  await expect(scenario.locator('[data-parity-target="highlight-basic"] mark')).toHaveCount(2);
  await expect(scenario.locator('.highlight-scenario__custom').first()).toHaveText('Semi');
  await expect(scenario.locator('[data-parity-target="highlight-regex"] mark')).toHaveCount(2);
  await expect(scenario.locator('[data-parity-target="highlight-regex"] mark').nth(1)).toHaveText(
    'Design   System',
  );
  await expect(scenario.locator('[data-parity-target="highlight-overlap"] strong')).toHaveCount(2);
  await expect(
    scenario.locator('[data-parity-target="highlight-overlap"] strong').first(),
  ).toHaveText('design system');
  expect(runtimeErrors).toEqual([]);
});

test('Highlight React/Vue 文本、computed style、几何与像素阈值一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'highlight',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('highlight').targets).toHaveLength(6);
  for (const target of assertScenarioComparable('highlight').targets) {
    await expectComparableTarget(pair, 'highlight', target.id);
  }

  for (const framework of [pair.react, pair.vue]) {
    const scenario = framework.page.getByTestId(
      framework === pair.react ? 'highlight-reference' : 'highlight-vue',
    );
    await expect(scenario.locator('[data-parity-target="highlight-basic"]')).toHaveText(
      '从 Semi Design 到 Any Design，快速定义你的设计系统',
    );
    await expect(scenario.locator('[data-parity-target="highlight-regex"] mark')).toHaveCount(2);
    await expect(scenario.locator('[data-parity-target="highlight-overlap"] strong')).toHaveCount(
      2,
    );
  }
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    pair.react.page.getByTestId('highlight-reference').screenshot({ animations: 'disabled' }),
    pair.vue.page.getByTestId('highlight-vue').screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Highlight React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'highlight',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const target of assertScenarioComparable('highlight').targets) {
        await expectComparableTarget(pair, 'highlight', target.id);
      }
      const reactTarget = pair.react.page.getByTestId('highlight-reference');
      const vueTarget = pair.vue.page.getByTestId('highlight-vue');
      await expect(reactTarget).toHaveScreenshot(
        `highlight-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`highlight-vue-${viewportName}-${theme}.png`);
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

test('Highlight React/Vue RTL 几何和截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'highlight',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('highlight').targets) {
    await expectComparableTarget(pair, 'highlight', target.id);
  }
  const reactTarget = pair.react.page.getByTestId('highlight-reference');
  const vueTarget = pair.vue.page.getByTestId('highlight-vue');
  await expect(reactTarget).toHaveScreenshot('highlight-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('highlight-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
