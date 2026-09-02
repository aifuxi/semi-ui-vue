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

test('Lottie 参考场景来自本地 v2.102.0 公开源码', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'lottie',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.lottiePublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'lottie')).toBe(true);
  await expect(page.getByTestId('lottie-reference').locator('.semi-lottie')).toHaveCount(2);
  await expect(page.locator('[data-parity-target="lottie-basic"] > svg')).toHaveCount(1);
  await expect(page.locator('[data-parity-target="lottie-external"] > svg')).toHaveCount(1);
  expect(runtimeErrors).toEqual([]);
});

test('Lottie React/Vue DOM、实例重建、样式与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'lottie',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('[data-parity-target="lottie-basic"] > svg')).toHaveCount(1);
    await expect(parityPage.locator('[data-parity-target="lottie-external"] > svg')).toHaveCount(1);
  }
  expect(assertScenarioComparable('lottie').targets).toHaveLength(4);
  for (const target of assertScenarioComparable('lottie').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'lottie', target.id));
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const status = parityPage.locator('.lottie-scenario__status');
    await expect(status).toHaveText('Variant blue');
    await parityPage.getByRole('button', { name: 'Use orange data' }).click();
    await expect(status).toHaveText('Variant orange');
    await expect(parityPage.locator('[data-parity-target="lottie-variant"] > svg')).toHaveCount(1);
  }

  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Lottie React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const pair = await openParityPages(
        context,
        {
          scenarioId: 'lottie',
          theme,
          direction: 'ltr',
          locale: 'zh-CN',
        },
        PARITY_VIEWPORTS[viewportName],
      );
      const reactTarget = pair.react.page.getByTestId('lottie-reference');
      const vueTarget = pair.vue.page.getByTestId('lottie-vue');
      await expect(reactTarget.locator('svg')).toHaveCount(3);
      await expect(vueTarget.locator('svg')).toHaveCount(3);
      await expect(reactTarget).toHaveScreenshot(`lottie-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`lottie-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    });
  }
}

test('Lottie React/Vue RTL 样式与截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'lottie',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('[data-parity-target="lottie-basic"]')).toHaveCSS(
      'direction',
      'rtl',
    );
  }
  const reactTarget = pair.react.page.getByTestId('lottie-reference');
  const vueTarget = pair.vue.page.getByTestId('lottie-vue');
  await expect(reactTarget.locator('svg')).toHaveCount(3);
  await expect(vueTarget.locator('svg')).toHaveCount(3);
  await expect(reactTarget).toHaveScreenshot('lottie-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('lottie-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
});
