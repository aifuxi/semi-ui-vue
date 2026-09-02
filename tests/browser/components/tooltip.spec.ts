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

test('Tooltip 参考场景来自本地 v2.102.0 并保留 Portal、箭头与 placement', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'tooltip',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.tooltipPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'tooltip')).toBe(true);
  await expect(page.getByTestId('tooltip-reference').locator('.semi-portal')).toHaveCount(4);
  await expect(page.locator('.semi-tooltip-wrapper-show')).toHaveCount(4);
  for (const position of ['top', 'right', 'bottom', 'left'] as const) {
    const popup = page.locator(`.tooltip-target-${position}`);
    await expect(popup).toHaveAttribute('x-placement', position);
    await expect(popup.locator('.semi-tooltip-icon-arrow')).toHaveCount(1);
    await expect(
      page.locator(`[data-parity-target="tooltip-trigger-${position}"]`),
    ).toHaveAttribute('aria-describedby', `tooltip-${position}`);
  }
  expect(runtimeErrors).toEqual([]);
});

test('Tooltip React/Vue 定位、hover、click、outside 与 disabled trigger 契约一致', async ({
  context,
}) => {
  const pair = await openParityPages(context, {
    scenarioId: 'tooltip',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  for (const target of assertScenarioComparable('tooltip').targets) {
    await expectComparableTarget(pair, 'tooltip', target.id);
  }

  const reactDisabled = pair.react.page.locator('[data-parity-target="tooltip-trigger-disabled"]');
  const vueDisabled = pair.vue.page.locator('[data-parity-target="tooltip-trigger-disabled"]');
  await Promise.all([expect(reactDisabled).toBeDisabled(), expect(vueDisabled).toBeDisabled()]);
  const [reactDisabledParent, vueDisabledParent] = await Promise.all([
    reactDisabled.evaluate((element) => element.parentElement?.className),
    vueDisabled.evaluate((element) => element.parentElement?.className),
  ]);
  expect(vueDisabledParent).toBe(reactDisabledParent);

  const reactHover = pair.react.page.locator('[data-parity-target="tooltip-trigger-hover"]');
  const vueHover = pair.vue.page.locator('[data-parity-target="tooltip-trigger-hover"]');
  await Promise.all([reactHover.hover(), vueHover.hover()]);
  await Promise.all([
    expect(pair.react.page.locator('#tooltip-hover')).toBeVisible(),
    expect(pair.vue.page.locator('#tooltip-hover')).toBeVisible(),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近变化：hover:true'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近变化：hover:true'),
  ]);

  const reactClick = pair.react.page.locator('[data-parity-target="tooltip-trigger-click"]');
  const vueClick = pair.vue.page.locator('[data-parity-target="tooltip-trigger-click"]');
  await Promise.all([reactClick.click(), vueClick.click()]);
  await Promise.all([
    expect(pair.react.page.locator('#tooltip-click')).toBeVisible(),
    expect(pair.vue.page.locator('#tooltip-click')).toBeVisible(),
  ]);
  await Promise.all([
    pair.react.page.locator('.tooltip-scenario__section h3').first().click(),
    pair.vue.page.locator('.tooltip-scenario__section h3').first().click(),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('#tooltip-click')).toHaveCount(0),
    expect(pair.vue.page.locator('#tooltip-click')).toHaveCount(0),
  ]);

  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Tooltip React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'tooltip',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      await Promise.all([pair.react.page.waitForTimeout(100), pair.vue.page.waitForTimeout(100)]);

      const reactTarget = pair.react.page.getByTestId('tooltip-reference');
      const vueTarget = pair.vue.page.getByTestId('tooltip-vue');
      await Promise.all([reactTarget.scrollIntoViewIfNeeded(), vueTarget.scrollIntoViewIfNeeded()]);
      await Promise.all([pair.react.page.waitForTimeout(100), pair.vue.page.waitForTimeout(100)]);
      await expect(reactTarget).toHaveScreenshot(`tooltip-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`tooltip-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    });
  }
}

test('Tooltip React/Vue RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'tooltip',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  const reactTarget = pair.react.page.getByTestId('tooltip-reference');
  const vueTarget = pair.vue.page.getByTestId('tooltip-vue');
  await expect(reactTarget).toHaveScreenshot('tooltip-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('tooltip-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
});
