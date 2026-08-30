import { expect, test } from '@playwright/test';
import {
  assertScenarioComparable,
  createParityScenarioUrl,
  PARITY_VIEWPORTS,
  REFERENCE_SOURCE_PATHS,
} from '../../../packages/test-infra/src';
import {
  expectComparableTarget,
  openParityPages,
  PARITY_APPLICATIONS,
  referenceSourceWasRequested,
} from '../parity-harness';

test('Typography 参考场景来自本地 v2.102.0 公开源码并保留 DOM 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'typography',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.typographyPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'typography')).toBe(true);
  const scenario = page.getByTestId('typography-reference');
  await expect(scenario.locator('.semi-typography')).toHaveCount(17);
  await expect(scenario.locator('h2.semi-typography-h2')).toHaveCount(1);
  await expect(scenario.locator('.semi-typography-paragraph')).toHaveCount(2);
  await expect(scenario.locator('.semi-typography-action-copy')).toHaveCount(1);
  await expect(scenario.locator('[data-parity-target="typography-numeral"]')).toHaveText(
    '1.50 KiB',
  );
  expect(runtimeErrors).toEqual([]);
});

test('Typography 标题、装饰、链接、数值、复制、样式和几何契约一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'typography',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  await Promise.all(
    [pair.react.page, pair.vue.page].map((parityPage) =>
      expect(
        parityPage.locator('[data-parity-target="typography-js-ellipsis"] > span').first(),
      ).toHaveText('Expandable typography content ...'),
    ),
  );
  expect(assertScenarioComparable('typography').targets).toHaveLength(10);
  for (const target of assertScenarioComparable('typography').targets) {
    await expectComparableTarget(pair, 'typography', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const decorated = parityPage.locator('[data-parity-target="typography-decorated"]');
    await expect(decorated.locator('del > strong > u > code > mark')).toHaveText('Decorated text');
    await expect(parityPage.locator('[data-parity-target="typography-link"] > a')).toHaveAttribute(
      'href',
      '#typography',
    );
    await expect(
      parityPage.locator('[data-parity-target="typography-disabled-link"] > span'),
    ).toHaveText('Disabled link');
    await expect(parityPage.locator('[data-parity-target="typography-numeral"]')).toHaveText(
      '1.50 KiB',
    );
  }

  const reactCopy = pair.react.page
    .locator('[data-parity-target="typography-copyable"]')
    .getByRole('button');
  const vueCopy = pair.vue.page
    .locator('[data-parity-target="typography-copyable"]')
    .getByRole('button');
  await Promise.all([reactCopy.press('Enter'), vueCopy.press('Enter')]);
  await Promise.all([
    expect(pair.react.page.locator('[data-parity-target="typography-copyable"]')).toContainText(
      '复制成功',
    ),
    expect(pair.vue.page.locator('[data-parity-target="typography-copyable"]')).toContainText(
      '复制成功',
    ),
  ]);

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const cssEllipsis = parityPage.locator('[data-parity-target="typography-css-ellipsis"]');
    await cssEllipsis.hover();
    await expect(parityPage.locator('[role="tooltip"]')).toContainText(
      'Typography ellipsis tooltip contains the complete original content.',
    );
    await parityPage.mouse.move(0, 0);

    const jsEllipsis = parityPage.locator('[data-parity-target="typography-js-ellipsis"]');
    const expand = jsEllipsis.getByRole('button', { name: '展开' });
    await expand.press('Enter');
    await expect(jsEllipsis).toContainText(
      'Expandable typography content keeps keyboard and collapse behavior aligned.',
    );
    await jsEllipsis.getByRole('button', { name: '收起' }).press('Enter');
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Typography React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'typography',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      await Promise.all(
        [pair.react.page, pair.vue.page].map(async (parityPage) => {
          const jsEllipsis = parityPage.locator('[data-parity-target="typography-js-ellipsis"]');
          await jsEllipsis.getByRole('button', { name: '展开' }).press('Enter');
          await expect(jsEllipsis.getByRole('button', { name: '收起' })).toBeVisible();
        }),
      );

      const reactTarget = pair.react.page.getByTestId('typography-reference');
      const vueTarget = pair.vue.page.getByTestId('typography-vue');
      await expect(reactTarget).toHaveScreenshot(
        `typography-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`typography-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
    });
  }
}
