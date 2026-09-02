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

test('Locale 参考场景来自本地 v2.102.0 Provider 与语言源', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'locale',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.localeProviderEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'locale')).toBe(true);
  await expect(page.getByTestId('locale-reference')).toContainText(
    'en-GB · GBP · Start Time · en-GB',
  );
  await expect(page.getByTestId('locale-reference')).toContainText('ja-JP · JPY · ページへ · ja');
  expect(
    requestedUrls.some((url) =>
      decodeURIComponent(url).includes(REFERENCE_SOURCE_PATHS.localeEnGBSource),
    ),
  ).toBe(true);
  expect(
    requestedUrls.some((url) =>
      decodeURIComponent(url).includes(REFERENCE_SOURCE_PATHS.localeJaJPSource),
    ),
  ).toBe(true);
  expect(runtimeErrors).toEqual([]);
});

test('Locale React/Vue slot 数据、响应式切换、样式与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'locale',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('locale').targets).toHaveLength(3);
  for (const target of assertScenarioComparable('locale').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'locale', target.id));
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const status = parityPage.locator('[data-parity-target="locale-switch"]');
    await expect(status).toHaveText('en-GB · Start Time');
    await parityPage.getByRole('button', { name: 'Use Japanese locale' }).click();
    await expect(status).toHaveText('ja-JP · 始まる時間');
  }

  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Locale React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const pair = await openParityPages(
        context,
        {
          scenarioId: 'locale',
          theme,
          direction: 'ltr',
          locale: 'zh-CN',
        },
        PARITY_VIEWPORTS[viewportName],
      );
      const reactTarget = pair.react.page.getByTestId('locale-reference');
      const vueTarget = pair.vue.page.getByTestId('locale-vue');
      await expect(reactTarget).toHaveScreenshot(`locale-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`locale-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    });
  }
}

test('Locale React/Vue RTL 样式与截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'locale',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('[data-parity-target="locale-en-gb"]')).toHaveCSS(
      'direction',
      'rtl',
    );
  }
  const reactTarget = pair.react.page.getByTestId('locale-reference');
  const vueTarget = pair.vue.page.getByTestId('locale-vue');
  await expect(reactTarget).toHaveScreenshot('locale-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('locale-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
});
