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

test('Avatar 参考场景来自本地 v2.102.0 并保留尺寸、图片、Group 与装饰 DOM', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'avatar',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.avatarPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'avatar')).toBe(true);
  const scenario = page.getByTestId('avatar-reference');
  await expect(scenario.locator('.semi-avatar')).toHaveCount(18);
  await expect(scenario.locator('.semi-avatar-extra-extra-small')).toHaveCount(1);
  await expect(scenario.locator('.semi-avatar-extra-large')).toHaveCount(1);
  await expect(scenario.locator('[data-parity-target="avatar-image"] > img')).toHaveAttribute(
    'alt',
    'Profile',
  );
  await expect(
    scenario.locator('[data-parity-target="avatar-group"] > .semi-avatar-group'),
  ).toHaveAttribute('role', 'list');
  await expect(scenario.locator('.semi-avatar-item-more')).toContainText('+2');
  await expect(scenario.locator('.semi-avatar-top_slot-content')).toHaveText('直播');
  await expect(scenario.locator('.semi-avatar-bottom_slot')).toHaveCount(2);
  expect(runtimeErrors).toEqual([]);
});

test('Avatar React/Vue 行为、样式、几何、图片回退、hover 与键盘一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'avatar',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('avatar').targets).toHaveLength(6);
  for (const target of assertScenarioComparable('avatar').targets) {
    await expectComparableTarget(pair, 'avatar', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const scenario = parityPage.locator('[data-parity-scenario="avatar"]');
    await expect(scenario.locator('.semi-avatar')).toHaveCount(18);
    await expect(scenario.locator('.semi-avatar-item-more')).toContainText('+2');
    await expect(scenario.locator('.semi-avatar-additionalBorder')).toHaveCount(1);
    await expect(scenario.locator('.semi-avatar-top_slot-content')).toHaveText('直播');
    await expect(scenario.locator('.semi-avatar-bottom_slot')).toHaveCount(2);
  }

  const reactHover = pair.react.page.locator('[data-parity-target="avatar-hover"]');
  const vueHover = pair.vue.page.locator('[data-parity-target="avatar-hover"]');
  await Promise.all([reactHover.hover(), vueHover.hover()]);
  await Promise.all([
    expect(reactHover.locator('.semi-avatar-hover')).toHaveText('编辑'),
    expect(vueHover.locator('.semi-avatar-hover')).toHaveText('编辑'),
  ]);
  const [reactMaskStyle, vueMaskStyle] = await Promise.all([
    captureComputedStyle(reactHover.locator('.avatar-scenario__mask'), [
      'alignItems',
      'backgroundColor',
      'color',
      'display',
      'height',
      'justifyContent',
      'width',
    ]),
    captureComputedStyle(vueHover.locator('.avatar-scenario__mask'), [
      'alignItems',
      'backgroundColor',
      'color',
      'display',
      'height',
      'justifyContent',
      'width',
    ]),
  ]);
  expect(vueMaskStyle).toEqual(reactMaskStyle);

  await Promise.all([reactHover.click(), vueHover.click()]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('头像已点击'),
    expect(pair.vue.page.getByRole('status')).toHaveText('头像已点击'),
  ]);

  const reactLabel = reactHover.locator('.semi-avatar-label');
  const vueLabel = vueHover.locator('.semi-avatar-label');
  await Promise.all([reactLabel.focus(), vueLabel.focus()]);
  await Promise.all([
    expect(reactHover).toHaveClass(/semi-avatar-focus/),
    expect(vueHover).toHaveClass(/semi-avatar-focus/),
  ]);
  await Promise.all([reactLabel.press('Enter'), vueLabel.press('Enter')]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('头像已点击'),
    expect(pair.vue.page.getByRole('status')).toHaveText('头像已点击'),
  ]);
  await Promise.all([reactLabel.press('Escape'), vueLabel.press('Escape')]);
  await Promise.all([
    expect(reactHover).not.toHaveClass(/semi-avatar-focus/),
    expect(vueHover).not.toHaveClass(/semi-avatar-focus/),
  ]);

  const reactImage = pair.react.page.locator('[data-parity-target="avatar-image"] > img');
  const vueImage = pair.vue.page.locator('[data-parity-target="avatar-image"] > img');
  await Promise.all([reactImage.dispatchEvent('error'), vueImage.dispatchEvent('error')]);
  await Promise.all([
    expect(pair.react.page.locator('[data-parity-target="avatar-image"]')).toHaveClass(
      /semi-avatar-grey/,
    ),
    expect(pair.vue.page.locator('[data-parity-target="avatar-image"]')).toHaveClass(
      /semi-avatar-grey/,
    ),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Avatar React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'avatar',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      const reactTarget = pair.react.page.getByTestId('avatar-reference');
      const vueTarget = pair.vue.page.getByTestId('avatar-vue');
      await expect(reactTarget).toHaveScreenshot(`avatar-reference-${viewportName}-${theme}.png`, {
        animations: 'disabled',
      });
      await expect(vueTarget).toHaveScreenshot(`avatar-vue-${viewportName}-${theme}.png`, {
        animations: 'disabled',
      });
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Avatar React/Vue RTL 重叠、样式、几何和截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'avatar',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('avatar').targets) {
    await expectComparableTarget(pair, 'avatar', target.id);
  }
  const [reactOverlap, vueOverlap] = await Promise.all([
    captureComputedStyle(
      pair.react.page.locator('[data-parity-target="avatar-group"] .semi-avatar').nth(1),
      ['marginLeft', 'marginRight', 'zIndex'],
    ),
    captureComputedStyle(
      pair.vue.page.locator('[data-parity-target="avatar-group"] .semi-avatar').nth(1),
      ['marginLeft', 'marginRight', 'zIndex'],
    ),
  ]);
  expect(vueOverlap).toEqual(reactOverlap);
  expect(reactOverlap).toMatchObject({ marginLeft: '0px', marginRight: '-12px' });
  const reactTarget = pair.react.page.getByTestId('avatar-reference');
  const vueTarget = pair.vue.page.getByTestId('avatar-vue');
  await expect(reactTarget).toHaveScreenshot('avatar-reference-light-rtl.png', {
    animations: 'disabled',
  });
  await expect(vueTarget).toHaveScreenshot('avatar-vue-light-rtl.png', {
    animations: 'disabled',
  });
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
