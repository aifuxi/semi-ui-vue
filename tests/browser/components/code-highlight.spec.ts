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

test('CodeHighlight 参考场景来自本地 v2.102.0 公开源码', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'code-highlight',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.codeHighlightPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'code-highlight')).toBe(true);
  await expect(
    page.getByTestId('code-highlight-reference').locator('.semi-codeHighlight'),
  ).toHaveCount(3);
  await expect(
    page.locator(
      '[data-parity-target="code-highlight-javascript"] code > .token.keyword:first-child',
    ),
  ).toHaveText('const');
  expect(runtimeErrors).toEqual([]);
});

test('CodeHighlight React/Vue token、行号、样式与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'code-highlight',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('code-highlight').targets).toHaveLength(5);
  for (const target of assertScenarioComparable('code-highlight').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'code-highlight', target.id));
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const javascript = parityPage.locator('[data-parity-target="code-highlight-javascript"]');
    await expect(javascript.locator('pre')).toHaveClass(/line-numbers/);
    await expect(javascript.locator('.line-numbers-rows > span')).toHaveCount(4);
    await expect(javascript.locator('code > .token.keyword:first-child')).toHaveText('const');

    const css = parityPage.locator('[data-parity-target="code-highlight-css"]');
    await expect(css.locator('pre')).not.toHaveClass(/line-numbers/);
    await expect(css.locator('.line-numbers-rows')).toHaveCount(0);
    await expect(css.locator('.token.selector')).toHaveText('.card');

    const custom = parityPage.locator('[data-parity-target="code-highlight-custom"]');
    await expect(custom).not.toHaveClass(/semi-codeHighlight-defaultTheme/);
    await expect(custom.locator('.token.tag').first()).toContainText('<button');
    await expect(custom.locator('button')).toHaveCount(0);
  }

  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`CodeHighlight React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const pair = await openParityPages(
        context,
        {
          scenarioId: 'code-highlight',
          theme,
          direction: 'ltr',
          locale: 'zh-CN',
        },
        PARITY_VIEWPORTS[viewportName],
      );
      const reactTarget = pair.react.page.getByTestId('code-highlight-reference');
      const vueTarget = pair.vue.page.getByTestId('code-highlight-vue');
      await expect(reactTarget).toHaveScreenshot(
        `code-highlight-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`code-highlight-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    });
  }
}

test('CodeHighlight React/Vue RTL 样式与截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'code-highlight',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(
      parityPage.locator('[data-parity-target="code-highlight-javascript"] pre'),
    ).toHaveCSS('direction', 'ltr');
    await expect(
      parityPage.locator('[data-parity-target="code-highlight-javascript"] pre'),
    ).toHaveCSS('text-align', 'left');
  }
  const reactTarget = pair.react.page.getByTestId('code-highlight-reference');
  const vueTarget = pair.vue.page.getByTestId('code-highlight-vue');
  await expect(reactTarget).toHaveScreenshot('code-highlight-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('code-highlight-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
});
