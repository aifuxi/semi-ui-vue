import { expect, test, type Page } from '@playwright/test';
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
  waitForStableRendering,
} from '../parity-harness';

async function expectMarkdownRenderReady(page: Page): Promise<void> {
  await expect(page.locator('.markdown-render-scenario .semi-markdownRender')).toHaveCount(1);
  await expect(page.locator('.markdown-render-scenario h2')).toContainText('MarkdownRender 对齐');
  await expect(page.locator('.markdown-render-scenario .semi-table-container')).toHaveCount(1);
  await expect(
    page.locator('.markdown-render-scenario .semi-table-tbody .semi-table-row'),
  ).toHaveCount(2);
  await waitForStableRendering(page);
}

test('MarkdownRender 参考场景来自本地 v2.102.0 且无运行时错误', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'markdown-render',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expectMarkdownRenderReady(page);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.markdownRenderPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'markdown-render')).toBe(true);
  expect(runtimeErrors).toEqual([]);
});

test('MarkdownRender React/Vue DOM、computed style 与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'markdown-render',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  await Promise.all([
    expectMarkdownRenderReady(pair.react.page),
    expectMarkdownRenderReady(pair.vue.page),
  ]);
  expect(assertScenarioComparable('markdown-render').targets).toHaveLength(4);
  for (const target of assertScenarioComparable('markdown-render').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'markdown-render', target.id));
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`MarkdownRender React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const pair = await openParityPages(
        context,
        { scenarioId: 'markdown-render', theme, direction: 'ltr', locale: 'zh-CN' },
        PARITY_VIEWPORTS[viewportName],
      );
      await Promise.all([
        expectMarkdownRenderReady(pair.react.page),
        expectMarkdownRenderReady(pair.vue.page),
      ]);
      const reactTarget = pair.react.page.getByTestId('markdown-render-reference');
      const vueTarget = pair.vue.page.getByTestId('markdown-render-vue');
      await expect(reactTarget).toHaveScreenshot(
        `markdown-render-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`markdown-render-vue-${viewportName}-${theme}.png`);
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

test('MarkdownRender RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'markdown-render',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  await Promise.all([
    expectMarkdownRenderReady(pair.react.page),
    expectMarkdownRenderReady(pair.vue.page),
  ]);
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('.markdown-render-scenario .semi-markdownRender')).toHaveCSS(
      'direction',
      'rtl',
    );
  }
  const reactTarget = pair.react.page.getByTestId('markdown-render-reference');
  const vueTarget = pair.vue.page.getByTestId('markdown-render-vue');
  await expect(reactTarget).toHaveScreenshot('markdown-render-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('markdown-render-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
