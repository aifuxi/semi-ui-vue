import { expect, test } from '@playwright/test';
import {
  assertScenarioComparable,
  createParityScenarioUrl,
  PARITY_VIEWPORTS,
  REFERENCE_SOURCE_PATHS,
} from '../../../packages/test-infra/src';
import {
  captureComputedStyle,
  expectComparableTarget,
  openParityPages,
  PARITY_APPLICATIONS,
  referenceSourceWasRequested,
} from '../parity-harness';

test('FloatButton 参考场景来自本地 v2.102.0 公开源码并保留 DOM 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'float-button',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.floatButtonPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'float-button')).toBe(true);
  await expect(page.getByTestId('float-button-reference').locator('.semi-floatButton')).toHaveCount(
    7,
  );
  await expect(page.locator('.float-button-target-colorful')).toHaveClass(/semi-floatButton-round/);
  await expect(page.locator('.float-button-target-colorful > .semi-floatButton-body')).toHaveClass(
    /semi-floatButton-colorful/,
  );
  await expect(page.locator('.float-button-target-badge .semi-badge-count')).toHaveText('99+');
  expect(runtimeErrors).toEqual([]);
});

test('FloatButton 尺寸、状态、Badge、Group 事件与可访问性契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'float-button',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('float-button').targets).toHaveLength(8);
  for (const target of assertScenarioComparable('float-button').targets) {
    await expectComparableTarget(pair, 'float-button', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const defaultButton = parityPage.locator('.float-button-target-default');
    await expect(defaultButton).toHaveCSS('width', '32px');
    await expect(parityPage.locator('.float-button-target-small')).toHaveCSS('height', '24px');
    await expect(parityPage.locator('.float-button-target-large')).toHaveCSS('height', '40px');
    await expect(defaultButton).toHaveJSProperty('tagName', 'DIV');
    await expect(defaultButton).toHaveJSProperty('tabIndex', -1);

    await defaultButton.click();
    await expect(parityPage.getByRole('status')).toHaveText('最近操作：default');
    await parityPage.locator('.float-button-target-disabled').click();
    await expect(parityPage.getByRole('status')).toHaveText('最近操作：default');
    await parityPage
      .locator('.float-button-target-group .semi-floatButtonGroup-item')
      .first()
      .dispatchEvent('click');
    await expect(parityPage.getByRole('status')).toHaveText('最近操作：support');
  }

  await Promise.all([
    pair.react.page.locator('.float-button-target-default .semi-floatButton-body').hover(),
    pair.vue.page.locator('.float-button-target-default .semi-floatButton-body').hover(),
  ]);
  const [reactHover, vueHover] = await Promise.all([
    captureComputedStyle(
      pair.react.page.locator('.float-button-target-default .semi-floatButton-body'),
      ['backgroundColor'],
    ),
    captureComputedStyle(
      pair.vue.page.locator('.float-button-target-default .semi-floatButton-body'),
      ['backgroundColor'],
    ),
  ]);
  expect(vueHover).toEqual(reactHover);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`FloatButton React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'float-button',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('float-button-reference');
      const vueTarget = pair.vue.page.getByTestId('float-button-vue');
      await expect(reactTarget).toHaveScreenshot(
        `float-button-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`float-button-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot(),
        vueTarget.screenshot(),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('FloatButton React/Vue RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'float-button',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  const reactTarget = pair.react.page.getByTestId('float-button-reference');
  const vueTarget = pair.vue.page.getByTestId('float-button-vue');
  await expect(reactTarget).toHaveScreenshot('float-button-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('float-button-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot(),
    vueTarget.screenshot(),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
});
