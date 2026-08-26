import { expect, test } from '@playwright/test';
import {
  assertScenarioComparable,
  createParityScenarioUrl,
  PARITY_VIEWPORTS,
  REFERENCE_SOURCE_PATHS,
} from '../../packages/test-infra/src';
import {
  captureComputedStyle,
  expectComparableTarget,
  openParityPages,
  PARITY_APPLICATIONS,
  referenceSourceWasRequested,
} from './parity-harness';

test('Button 参考场景来自本地 v2.102.0 公开源码并保留公开行为', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'button-types',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  const root = page.locator('[data-parity-framework="react"]');
  await expect(root).toHaveAttribute('data-parity-scenario', 'button-types');
  await expect(root).toHaveAttribute('data-reference-status', 'ready');
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.buttonPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'button-types')).toBe(true);

  const buttons = page.getByTestId('button-types-reference').getByRole('button');
  await expect(buttons).toHaveCount(5);
  await expect(buttons.nth(0)).toHaveClass(/semi-button-primary/);
  await expect(buttons.nth(0)).toHaveClass(/semi-button-light/);

  const primaryStyle = await buttons.nth(0).evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      borderRadius: style.borderRadius,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      height: style.height,
      lineHeight: style.lineHeight,
      paddingLeft: style.paddingLeft,
      paddingRight: style.paddingRight,
    };
  });
  expect(primaryStyle).toEqual({
    borderRadius: '3px',
    fontSize: '14px',
    fontWeight: '600',
    height: '32px',
    lineHeight: '20px',
    paddingLeft: '12px',
    paddingRight: '12px',
  });

  await buttons.nth(0).click();
  await expect(page.getByRole('status')).toHaveText('最近操作：主要按钮');
  expect(runtimeErrors).toEqual([]);
});

test('Button 类型场景在同一 Chromium 中保持行为、样式、几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'button-types',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  await expect(pair.react.page.locator('[data-parity-framework="react"]')).toHaveAttribute(
    'data-reference-status',
    'ready',
  );
  await expect(pair.vue.page.locator('[data-parity-framework="vue"]')).toHaveAttribute(
    'data-vue-status',
    'ready',
  );
  expect(assertScenarioComparable('button-types').targets).toHaveLength(5);

  for (const target of assertScenarioComparable('button-types').targets) {
    await expectComparableTarget(pair, 'button-types', target.id);
  }

  await Promise.all([pair.react.page.keyboard.press('Tab'), pair.vue.page.keyboard.press('Tab')]);
  const [reactFocus, vueFocus] = await Promise.all([
    captureComputedStyle(pair.react.page.locator('[data-parity-target="button-primary"]'), [
      'outlineStyle',
      'outlineWidth',
    ]),
    captureComputedStyle(pair.vue.page.locator('[data-parity-target="button-primary"]'), [
      'outlineStyle',
      'outlineWidth',
    ]),
  ]);
  expect(vueFocus).toEqual(reactFocus);
  expect(reactFocus).toEqual({ outlineStyle: 'solid', outlineWidth: '2px' });

  await Promise.all([
    pair.react.page.keyboard.press('Enter'),
    pair.vue.page.keyboard.press('Enter'),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近操作：主要按钮'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近操作：主要按钮'),
  ]);

  const reactDanger = pair.react.page.locator('[data-parity-target="button-danger"]');
  const vueDanger = pair.vue.page.locator('[data-parity-target="button-danger"]');
  await Promise.all([reactDanger.click(), vueDanger.click()]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近操作：危险按钮'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近操作：危险按钮'),
  ]);

  await Promise.all([
    pair.react.page.locator('[data-parity-target="button-primary"]').hover(),
    pair.vue.page.locator('[data-parity-target="button-primary"]').hover(),
  ]);
  const [reactHover, vueHover] = await Promise.all([
    captureComputedStyle(pair.react.page.locator('[data-parity-target="button-primary"]'), [
      'backgroundColor',
    ]),
    captureComputedStyle(pair.vue.page.locator('[data-parity-target="button-primary"]'), [
      'backgroundColor',
    ]),
  ]);
  expect(vueHover).toEqual(reactHover);

  await Promise.all([pair.react.page.mouse.down(), pair.vue.page.mouse.down()]);
  const [reactActive, vueActive] = await Promise.all([
    captureComputedStyle(pair.react.page.locator('[data-parity-target="button-primary"]'), [
      'backgroundColor',
    ]),
    captureComputedStyle(pair.vue.page.locator('[data-parity-target="button-primary"]'), [
      'backgroundColor',
    ]),
  ]);
  await Promise.all([pair.react.page.mouse.up(), pair.vue.page.mouse.up()]);
  expect(vueActive).toEqual(reactActive);
  expect(reactActive).not.toEqual(reactHover);

  await Promise.all([reactDanger.click(), vueDanger.click()]);
  await Promise.all([
    pair.react.page.locator('[data-parity-target="button-primary"]').focus(),
    pair.vue.page.locator('[data-parity-target="button-primary"]').focus(),
  ]);
  await Promise.all([
    pair.react.page.keyboard.press('Space'),
    pair.vue.page.keyboard.press('Space'),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近操作：主要按钮'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近操作：主要按钮'),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('Button 图标、加载、禁用、组合、Split 与 RTL 契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'button-contract',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });

  for (const target of assertScenarioComparable('button-contract').targets) {
    await expectComparableTarget(pair, 'button-contract', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const root = parityPage.locator('[data-parity-scenario="button-contract"]');
    await expect(root).toHaveClass(/semi-rtl/);
    await expect(parityPage.locator('[data-parity-target="button-disabled"]')).toBeDisabled();
    await expect(parityPage.locator('[data-parity-target="button-disabled"]')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    await expect(parityPage.locator('[data-parity-target="button-loading"]')).toHaveClass(
      /semi-button-loading/,
    );
    await expect(
      parityPage.locator('[data-parity-target="button-loading"] [data-icon="spin"]'),
    ).toBeVisible();
    await expect(
      parityPage.getByRole('group', { name: '编辑操作' }).getByRole('button'),
    ).toHaveCount(3);
    const splitButtons = parityPage.getByRole('group', { name: '项目操作' }).getByRole('button');
    await expect(splitButtons.first()).toHaveClass(/semi-button-first/);
    await expect(splitButtons.last()).toHaveClass(/semi-button-last/);
  }

  const [reactIconSpacing, vueIconSpacing] = await Promise.all([
    captureComputedStyle(
      pair.react.page.locator('[data-parity-target="button-icon-right"] .semi-button-content-left'),
      ['marginLeft', 'marginRight'],
    ),
    captureComputedStyle(
      pair.vue.page.locator('[data-parity-target="button-icon-right"] .semi-button-content-left'),
      ['marginLeft', 'marginRight'],
    ),
  ]);
  expect(vueIconSpacing).toEqual(reactIconSpacing);
  expect(reactIconSpacing).toEqual({ marginLeft: '8px', marginRight: '0px' });

  const [reactAnimation, vueAnimation] = await Promise.all(
    [pair.react.page, pair.vue.page].map((page) =>
      page
        .locator('[data-parity-target="button-loading"] [data-icon="spin"]')
        .evaluate((element) => {
          const animation = element.getAnimations()[0];
          return {
            duration: animation?.effect?.getTiming().duration,
            iterations: animation?.effect?.getTiming().iterations,
          };
        }),
    ),
  );
  expect(vueAnimation).toEqual(reactAnimation);
  expect(reactAnimation).toEqual({ duration: 600, iterations: Infinity });
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Button React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'button-types',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('button-types-reference');
      const vueTarget = pair.vue.page.getByTestId('button-types-vue');
      await expect(reactTarget).toHaveScreenshot(
        `button-types-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`button-types-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot(),
        vueTarget.screenshot(),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

for (const { theme, direction } of [
  { theme: 'light', direction: 'ltr' },
  { theme: 'dark', direction: 'ltr' },
  { theme: 'light', direction: 'rtl' },
] as const) {
  test(`Button contract React/Vue 截图：${theme}/${direction}`, async ({ context }) => {
    const pair = await openParityPages(context, {
      scenarioId: 'button-contract',
      theme,
      direction,
      locale: 'zh-CN',
    });
    const reactTarget = pair.react.page.getByTestId('button-contract-reference');
    const vueTarget = pair.vue.page.getByTestId('button-contract-vue');
    await expect(reactTarget).toHaveScreenshot(
      `button-contract-reference-${theme}-${direction}.png`,
    );
    await expect(vueTarget).toHaveScreenshot(`button-contract-vue-${theme}-${direction}.png`);
    const [reactScreenshot, vueScreenshot] = await Promise.all([
      reactTarget.screenshot({ animations: 'disabled' }),
      vueTarget.screenshot({ animations: 'disabled' }),
    ]);
    expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  });
}

test('Divider 参考场景来自本地 v2.102.0 公开源码并保留 DOM 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'divider',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.dividerPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'divider')).toBe(true);
  await expect(page.getByTestId('divider-reference').locator('.semi-divider')).toHaveCount(8);
  await expect(page.getByRole('separator', { name: '章节分隔' })).toHaveClass(
    /semi-divider-horizontal/,
  );
  await expect(page.getByRole('separator', { name: '操作分隔' })).toHaveAttribute(
    'aria-orientation',
    'vertical',
  );
  await expect(page.locator('[data-parity-target="divider-content-left"]')).toHaveClass(
    /semi-divider-with-text-left/,
  );
  expect(runtimeErrors).toEqual([]);
});

test('Divider 水平、垂直、虚线、内容与 RTL 契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'divider',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });

  for (const target of assertScenarioComparable('divider').targets) {
    await expectComparableTarget(pair, 'divider', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('[data-parity-scenario="divider"]')).toHaveClass(/semi-rtl/);
    await expect(parityPage.locator('[data-parity-target="divider-horizontal-dashed"]')).toHaveCSS(
      'border-bottom-style',
      'dashed',
    );
    await expect(parityPage.locator('[data-parity-target="divider-vertical-dashed"]')).toHaveCSS(
      'border-left-style',
      'dashed',
    );
    await expect(parityPage.getByRole('separator', { name: '章节分隔' })).toBeVisible();
    await expect(parityPage.getByRole('separator', { name: '操作分隔' })).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
  }

  const readPseudoLineWidths = (selector: string) => {
    const read = (page: typeof pair.react.page) =>
      page.locator(selector).evaluate((element) => ({
        afterWidth: getComputedStyle(element, '::after').width,
        beforeWidth: getComputedStyle(element, '::before').width,
      }));
    return Promise.all([read(pair.react.page), read(pair.vue.page)]);
  };
  const [reactLeft, vueLeft] = await readPseudoLineWidths(
    '[data-parity-target="divider-content-left"]',
  );
  const [reactRight, vueRight] = await readPseudoLineWidths(
    '[data-parity-target="divider-content-right"]',
  );
  expect(vueLeft).toEqual(reactLeft);
  expect(vueRight).toEqual(reactRight);
  expect(reactLeft.beforeWidth).toBe('40px');
  expect(reactRight.afterWidth).toBe('40px');
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Divider React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'divider',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('divider-reference');
      const vueTarget = pair.vue.page.getByTestId('divider-vue');
      await expect(reactTarget).toHaveScreenshot(`divider-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`divider-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot(),
        vueTarget.screenshot(),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('Divider React/Vue RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'divider',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  const reactTarget = pair.react.page.getByTestId('divider-reference');
  const vueTarget = pair.vue.page.getByTestId('divider-vue');
  await expect(reactTarget).toHaveScreenshot('divider-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('divider-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot(),
    vueTarget.screenshot(),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
});

test('Icon 参考场景来自本地 v2.102.0 公开源码并保留 DOM 与无障碍契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'icon',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.iconPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'icon')).toBe(true);
  await expect(page.getByTestId('icon-reference').locator('.semi-icon')).toHaveCount(12);
  await expect(page.getByRole('img', { name: '首页图标 extra-small' })).toHaveClass(
    /semi-icon-extra-small/,
  );
  await expect(page.getByRole('img', { name: '加载中' })).toHaveClass(/semi-icon-spinning/);
  await expect(page.getByRole('img', { name: 'Lab 头像' }).locator('svg')).toHaveCount(1);
  await expect(page.getByRole('img', { name: '自定义圆点' })).toHaveClass(/semi-icon-custom-dot/);
  expect(runtimeErrors).toEqual([]);
});

test('Icon 尺寸、旋转、动画、颜色、AI fill 与 Lab 契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'icon',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('icon').targets).toHaveLength(11);
  for (const target of assertScenarioComparable('icon').targets) {
    await expectComparableTarget(pair, 'icon', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('[data-parity-target="icon-size-extra-small"]')).toHaveCSS(
      'font-size',
      '8px',
    );
    await expect(parityPage.locator('[data-parity-target="icon-size-extra-large"]')).toHaveCSS(
      'font-size',
      '24px',
    );
    await expect(parityPage.locator('[data-parity-target="icon-rotate"]')).toHaveCSS(
      'transform',
      'matrix(-1, 0, 0, -1, 0, 0)',
    );
    const bicolorPaths = parityPage.locator('[data-parity-target="icon-bicolor"] path');
    await expect(bicolorPaths.nth(0)).toHaveAttribute('fill', '#0064fa');
    await expect(bicolorPaths.nth(1)).toHaveAttribute('fill', '#15c39a');
  }

  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Icon React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'icon',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('icon-reference');
      const vueTarget = pair.vue.page.getByTestId('icon-vue');
      await expect(reactTarget).toHaveScreenshot(`icon-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`icon-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}
