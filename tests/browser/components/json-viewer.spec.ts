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

async function expectJsonViewerReady(page: Page): Promise<void> {
  await expect(page.locator('.json-viewer-scenario__main .semi-json-viewer-view-line')).toHaveCount(
    7,
  );
  await expect(page.locator('.json-viewer-scenario__custom-token')).toContainText('Semi UI Vue');
  await waitForStableRendering(page);
}

test('JsonViewer 参考场景来自本地 v2.102.0，Worker 内联且无运行时错误', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'json-viewer',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expectJsonViewerReady(page);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.jsonViewerPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'json-viewer')).toBe(true);
  expect(
    requestedUrls.filter((url) =>
      /(?:^|\/)json[-.]?worker(?:\.[a-z0-9_-]+)?\.js(?:\?|$)/i.test(url),
    ),
  ).toEqual([]);
  expect(runtimeErrors).toEqual([]);
});

test('JsonViewer React/Vue DOM、搜索替换、自定义渲染、样式与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'json-viewer',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  await Promise.all([expectJsonViewerReady(pair.react.page), expectJsonViewerReady(pair.vue.page)]);

  expect(assertScenarioComparable('json-viewer').targets).toHaveLength(4);
  for (const target of assertScenarioComparable('json-viewer').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'json-viewer', target.id));
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await parityPage
      .locator('.json-viewer-scenario__main .semi-json-viewer-search-bar-trigger')
      .click();
    const search = parityPage.locator(
      '.json-viewer-scenario__main .semi-json-viewer-search-bar-input input',
    );
    await search.fill('Vue');
    await expect(
      parityPage.locator('.json-viewer-scenario__main .semi-json-viewer-search-result'),
    ).toHaveCount(2);
    await parityPage
      .locator('.json-viewer-scenario__main .semi-json-viewer-replace-bar-input input')
      .fill('Adapter');
    await parityPage
      .locator('.json-viewer-scenario__main .semi-json-viewer-replace-bar button')
      .last()
      .click();
    const content = parityPage.locator('.json-viewer-scenario__main .lines-content');
    await expect(content).toContainText('Semi UI Adapter');
    await expect(content).toContainText('Adapter');
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`JsonViewer React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const pair = await openParityPages(
        context,
        { scenarioId: 'json-viewer', theme, direction: 'ltr', locale: 'zh-CN' },
        PARITY_VIEWPORTS[viewportName],
      );
      await Promise.all([
        expectJsonViewerReady(pair.react.page),
        expectJsonViewerReady(pair.vue.page),
      ]);
      const reactTarget = pair.react.page.getByTestId('json-viewer-reference');
      const vueTarget = pair.vue.page.getByTestId('json-viewer-vue');
      await expect(reactTarget).toHaveScreenshot(
        `json-viewer-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`json-viewer-vue-${viewportName}-${theme}.png`);
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

test('JsonViewer en-US Locale 与 RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'json-viewer',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  await Promise.all([expectJsonViewerReady(pair.react.page), expectJsonViewerReady(pair.vue.page)]);
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await parityPage
      .locator('.json-viewer-scenario__main .semi-json-viewer-search-bar-trigger')
      .click();
    await expect(
      parityPage.locator('.json-viewer-scenario__main input[placeholder="Search"]'),
    ).toBeVisible();
    await expect(
      parityPage.locator('.json-viewer-scenario__main input[placeholder="Replace"]'),
    ).toBeVisible();
  }
  const reactTarget = pair.react.page.getByTestId('json-viewer-reference');
  const vueTarget = pair.vue.page.getByTestId('json-viewer-vue');
  await expect(reactTarget).toHaveScreenshot('json-viewer-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('json-viewer-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
