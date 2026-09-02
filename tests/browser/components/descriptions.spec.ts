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

test('Descriptions 参考场景来自本地 v2.102.0 并保留 table/span/hidden 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'descriptions',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'descriptions')).toBe(true);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.descriptionsPublicEntry,
  );
  const scenario = page.getByTestId('descriptions-reference');
  await expect(scenario.locator('.semi-descriptions')).toHaveCount(7);
  await expect(
    scenario.locator('[data-parity-target="descriptions-horizontal"] tbody > tr'),
  ).toHaveCount(2);
  await expect(
    scenario
      .locator('[data-parity-target="descriptions-horizontal"] tbody > tr')
      .last()
      .locator('td')
      .last(),
  ).toHaveAttribute('colspan', '3');
  await expect(scenario).not.toContainText('不可见');
  expect(runtimeErrors).toEqual([]);
});

test('Descriptions React/Vue DOM、computed style、几何与像素阈值一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'descriptions',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('descriptions').targets).toHaveLength(6);
  for (const target of assertScenarioComparable('descriptions').targets) {
    await expectComparableTarget(pair, 'descriptions', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const scenario = parityPage.locator('.descriptions-scenario');
    await expect(scenario.locator('.semi-descriptions-center')).toHaveCount(2);
    await expect(scenario.locator('.semi-descriptions-plain')).toHaveCount(1);
    await expect(scenario.locator('.semi-descriptions-double')).toHaveCount(3);
    await expect(scenario.locator('.semi-descriptions-horizontal')).toHaveCount(1);
    await expect(scenario.locator('[tabindex]')).toHaveCount(0);
    await expect(scenario).not.toContainText('不可见');
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Descriptions React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'descriptions',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      for (const target of assertScenarioComparable('descriptions').targets) {
        await expectComparableTarget(pair, 'descriptions', target.id);
      }
      const reactTarget = pair.react.page.getByTestId('descriptions-reference');
      const vueTarget = pair.vue.page.getByTestId('descriptions-vue');
      await expect(reactTarget).toHaveScreenshot(
        `descriptions-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`descriptions-vue-${viewportName}-${theme}.png`);
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

test('Descriptions React/Vue RTL 几何和截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'descriptions',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('descriptions').targets) {
    await expectComparableTarget(pair, 'descriptions', target.id);
  }
  const reactTarget = pair.react.page.getByTestId('descriptions-reference');
  const vueTarget = pair.vue.page.getByTestId('descriptions-vue');
  await expect(reactTarget).toHaveScreenshot('descriptions-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('descriptions-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
