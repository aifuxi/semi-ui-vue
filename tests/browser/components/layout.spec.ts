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

test('Layout 参考场景来自本地 v2.102.0 公开源码并保留 DOM 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'layout',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.layoutPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'layout')).toBe(true);
  await expect(page.getByTestId('layout-reference').locator('.semi-layout')).toHaveCount(4);
  await expect(page.locator('[data-parity-target="layout-with-sider"]')).toHaveClass(
    /semi-layout-has-sider/,
  );
  await expect(page.locator('[data-parity-target="layout-sider"]')).toHaveAttribute(
    'data-breakpoint-source',
    'layout',
  );
  await expect(page.locator('[data-parity-target="layout-sider"] > div')).toHaveClass(
    /semi-layout-sider-children/,
  );
  expect(runtimeErrors).toEqual([]);
});

test('Layout 语义、嵌套、Sider 与响应式断点契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'layout',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('layout').targets).toHaveLength(8);
  for (const target of assertScenarioComparable('layout').targets) {
    await expectComparableTarget(pair, 'layout', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('[data-parity-target="layout-vertical"]')).toHaveCSS(
      'flex-direction',
      'column',
    );
    await expect(parityPage.locator('[data-parity-target="layout-with-sider"]')).toHaveCSS(
      'flex-direction',
      'row',
    );
    await expect(parityPage.locator('[data-parity-target="layout-with-sider"]')).toHaveCSS(
      'direction',
      'rtl',
    );
    await expect(parityPage.locator('[data-parity-target="layout-sider"]')).toHaveCSS(
      'position',
      'relative',
    );
    await expect(parityPage.locator('[data-parity-target="layout-semantic"]')).toHaveJSProperty(
      'tagName',
      'ARTICLE',
    );
    await expect(parityPage.locator('[data-parity-target="layout-semantic"]')).toHaveAttribute(
      'role',
      'region',
    );
    await expect(parityPage.locator('[data-parity-target="layout-sider"]')).toHaveAttribute(
      'aria-label',
      '演示侧边栏',
    );
    await expect(parityPage.getByRole('status')).toHaveText('xs:false · md:true');
  }

  const narrowViewport = PARITY_VIEWPORTS.narrow;
  await Promise.all([
    pair.react.page.setViewportSize(narrowViewport),
    pair.vue.page.setViewportSize(narrowViewport),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('xs:true · md:false'),
    expect(pair.vue.page.getByRole('status')).toHaveText('xs:true · md:false'),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'narrow'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Layout React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'layout',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('layout-reference');
      const vueTarget = pair.vue.page.getByTestId('layout-vue');
      await expect(reactTarget).toHaveScreenshot(`layout-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`layout-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot(),
        vueTarget.screenshot(),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    });
  }
}

test('Layout React/Vue RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'layout',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  const reactTarget = pair.react.page.getByTestId('layout-reference');
  const vueTarget = pair.vue.page.getByTestId('layout-vue');
  await expect(reactTarget).toHaveScreenshot('layout-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('layout-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot(),
    vueTarget.screenshot(),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
});
