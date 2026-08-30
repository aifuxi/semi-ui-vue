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

test('TagInput 参考场景来自本地 v2.102.0 并保留标签、折叠与输入 DOM', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'tag-input',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.tagInputPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'tag-input')).toBe(true);
  const scenario = page.getByTestId('tag-input-reference');
  await expect(scenario.locator('.semi-tagInput')).toHaveCount(7);
  await expect(scenario.locator('[data-parity-target="tag-input-basic"] .semi-tag')).toHaveCount(3);
  await expect(
    scenario.locator('[data-parity-target="tag-input-collapsed"] .semi-tag'),
  ).toHaveCount(2);
  await expect(
    scenario.locator('[data-parity-target="tag-input-collapsed"] .semi-tagInput-wrapper-n'),
  ).toHaveText('+2');
  await expect(scenario.locator('[data-parity-target="tag-input-disabled"] input')).toBeDisabled();
  expect(runtimeErrors).toEqual([]);
});

test('TagInput React/Vue 添加、删除、焦点、Popover、样式与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'tag-input',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('tag-input').targets).toHaveLength(7);
  for (const target of assertScenarioComparable('tag-input').targets) {
    await expectComparableTarget(pair, 'tag-input', target.id);
  }

  const reactBasic = pair.react.page.locator('[data-parity-target="tag-input-basic"]');
  const vueBasic = pair.vue.page.locator('[data-parity-target="tag-input-basic"]');
  const reactInput = reactBasic.locator('input');
  const vueInput = vueBasic.locator('input');
  await Promise.all([reactInput.fill('新增'), vueInput.fill('新增')]);
  await Promise.all([reactInput.press('Enter'), vueInput.press('Enter')]);
  await Promise.all([
    expect(reactBasic.locator('.semi-tag')).toHaveCount(4),
    expect(vueBasic.locator('.semi-tag')).toHaveCount(4),
    expect(pair.react.page.getByRole('status')).toContainText('新增'),
    expect(pair.vue.page.getByRole('status')).toContainText('新增'),
  ]);

  const reactLastTag = reactBasic.locator('.semi-tag').last();
  const vueLastTag = vueBasic.locator('.semi-tag').last();
  await Promise.all([reactLastTag.focus(), vueLastTag.focus()]);
  await Promise.all([reactLastTag.press('Delete'), vueLastTag.press('Delete')]);
  await Promise.all([
    expect(reactBasic.locator('.semi-tag')).toHaveCount(3),
    expect(vueBasic.locator('.semi-tag')).toHaveCount(3),
  ]);

  const reactRest = pair.react.page.locator(
    '[data-parity-target="tag-input-collapsed"] .semi-tagInput-wrapper-n',
  );
  const vueRest = pair.vue.page.locator(
    '[data-parity-target="tag-input-collapsed"] .semi-tagInput-wrapper-n',
  );
  await Promise.all([reactRest.hover(), vueRest.hover()]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-popover-wrapper')).toContainText('Vue'),
    expect(pair.vue.page.locator('.semi-popover-wrapper')).toContainText('Vue'),
  ]);
  const [reactPopover, vuePopover] = await Promise.all([
    captureComputedStyle(pair.react.page.locator('.semi-popover-wrapper'), [
      'backgroundColor',
      'borderRadius',
      'padding',
    ]),
    captureComputedStyle(pair.vue.page.locator('.semi-popover-wrapper'), [
      'backgroundColor',
      'borderRadius',
      'padding',
    ]),
  ]);
  expect(vuePopover).toEqual(reactPopover);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`TagInput React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'tag-input',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      const reactTarget = pair.react.page.getByTestId('tag-input-reference');
      const vueTarget = pair.vue.page.getByTestId('tag-input-vue');
      await expect(reactTarget).toHaveScreenshot(
        `tag-input-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`tag-input-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}

test('TagInput React/Vue RTL 样式、几何与截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'tag-input',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('tag-input').targets) {
    await expectComparableTarget(pair, 'tag-input', target.id);
  }
  const [reactMargin, vueMargin] = await Promise.all([
    captureComputedStyle(pair.react.page.locator('.semi-tagInput-wrapper-tag').first(), [
      'marginLeft',
      'marginRight',
    ]),
    captureComputedStyle(pair.vue.page.locator('.semi-tagInput-wrapper-tag').first(), [
      'marginLeft',
      'marginRight',
    ]),
  ]);
  expect(vueMargin).toEqual(reactMargin);
  const reactTarget = pair.react.page.getByTestId('tag-input-reference');
  const vueTarget = pair.vue.page.getByTestId('tag-input-vue');
  await expect(reactTarget).toHaveScreenshot('tag-input-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('tag-input-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
});
