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

test('Empty 参考场景来自本地 v2.102.0 并保留图片、内容与 SVG 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'empty',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'empty')).toBe(true);
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'illustrations')).toBe(true);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.emptyPublicEntry,
  );
  const scenario = page.getByTestId('empty-reference');
  await expect(scenario.locator('.semi-empty')).toHaveCount(5);
  await expect(
    scenario.locator('[data-parity-target="empty-vertical"] .empty-scenario__illustration'),
  ).toHaveAttribute('data-variant', 'light');
  await expect(
    scenario.locator('[data-parity-target="empty-vertical"] .empty-scenario__illustration'),
  ).toHaveAttribute('viewBox', '0 0 200 200');
  await expect(
    scenario.locator('[data-parity-target="empty-vertical"] .empty-scenario__illustration'),
  ).toHaveCSS('width', '150px');
  await expect(scenario.locator('[data-parity-target="empty-no-image"] h6')).toHaveText(
    '未找到匹配结果',
  );
  await expect(scenario.locator('[data-parity-target="empty-symbol"] svg')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  await expect(scenario.locator('[data-parity-target="empty-string-image"] img')).toHaveAttribute(
    'alt',
    '添加一个项目',
  );
  expect(runtimeErrors).toEqual([]);
});

test('Empty React/Vue DOM、暗色切换、computed style、几何与像素阈值一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'empty',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('empty').targets).toHaveLength(8);
  for (const target of assertScenarioComparable('empty').targets) {
    await expectComparableTarget(pair, 'empty', target.id);
  }

  await Promise.all([
    expect(pair.react.page.locator('[data-parity-target="empty-vertical"] h4')).toHaveText(
      '暂无数据',
    ),
    expect(pair.vue.page.locator('[data-parity-target="empty-vertical"] h4')).toHaveText(
      '暂无数据',
    ),
    expect(pair.react.page.locator('[data-parity-target="empty-no-image"] h6')).toHaveCount(1),
    expect(pair.vue.page.locator('[data-parity-target="empty-no-image"] h6')).toHaveCount(1),
  ]);
  await Promise.all([
    pair.react.page.evaluate(() => document.body.setAttribute('theme-mode', 'dark')),
    pair.vue.page.evaluate(() => document.body.setAttribute('theme-mode', 'dark')),
  ]);
  await Promise.all([
    expect(
      pair.react.page.locator(
        '[data-parity-target="empty-vertical"] .empty-scenario__illustration',
      ),
    ).toHaveAttribute('data-variant', 'dark'),
    expect(
      pair.vue.page.locator('[data-parity-target="empty-vertical"] .empty-scenario__illustration'),
    ).toHaveAttribute('data-variant', 'dark'),
  ]);
  await Promise.all([
    pair.react.page.evaluate(() => document.body.setAttribute('theme-mode', 'light')),
    pair.vue.page.evaluate(() => document.body.setAttribute('theme-mode', 'light')),
  ]);
  await Promise.all([
    expect(
      pair.react.page.locator(
        '[data-parity-target="empty-horizontal"] .empty-scenario__illustration',
      ),
    ).toHaveAttribute('data-variant', 'light'),
    expect(
      pair.vue.page.locator(
        '[data-parity-target="empty-horizontal"] .empty-scenario__illustration',
      ),
    ).toHaveAttribute('data-variant', 'light'),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Empty React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'empty',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      await Promise.all([
        expect(
          pair.react.page.locator(
            '[data-parity-target="empty-vertical"] .empty-scenario__illustration',
          ),
        ).toHaveAttribute('data-variant', theme),
        expect(
          pair.vue.page.locator(
            '[data-parity-target="empty-vertical"] .empty-scenario__illustration',
          ),
        ).toHaveAttribute('data-variant', theme),
      ]);
      for (const target of assertScenarioComparable('empty').targets) {
        await expectComparableTarget(pair, 'empty', target.id);
      }
      const reactTarget = pair.react.page.getByTestId('empty-reference');
      const vueTarget = pair.vue.page.getByTestId('empty-vue');
      await expect(reactTarget).toHaveScreenshot(`empty-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`empty-vue-${viewportName}-${theme}.png`);
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

test('Empty React/Vue RTL 几何和截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'empty',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('empty').targets) {
    await expectComparableTarget(pair, 'empty', target.id);
  }
  const reactContent = pair.react.page.locator(
    '[data-parity-target="empty-horizontal"] > .semi-empty-content',
  );
  const vueContent = pair.vue.page.locator(
    '[data-parity-target="empty-horizontal"] > .semi-empty-content',
  );
  await Promise.all([
    expect(reactContent).toHaveCSS('margin-right', '32px'),
    expect(vueContent).toHaveCSS('margin-right', '32px'),
  ]);
  const reactTarget = pair.react.page.getByTestId('empty-reference');
  const vueTarget = pair.vue.page.getByTestId('empty-vue');
  await expect(reactTarget).toHaveScreenshot('empty-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('empty-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
