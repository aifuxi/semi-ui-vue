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

test('ConfigProvider 参考场景来自本地 v2.102.0 并保留 Context 契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'config-provider',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.configProviderPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'config-provider')).toBe(true);
  const scenario = page.getByTestId('config-provider-reference');
  await expect(scenario.locator(':scope > .semi-rtl')).toHaveCount(1);
  await expect(scenario.locator('[data-parity-target="config-provider-direction"]')).toHaveText(
    'direction: rtl',
  );
  await expect(scenario).toContainText('locale: en-US');
  await expect(scenario).toContainText('timeZone: Asia/Shanghai');
  await expect(scenario.locator('[data-parity-target="config-provider-nested"]')).toHaveText(
    'nested: ltr',
  );
  await expect(scenario.getByRole('button', { name: 'Copy' })).toHaveCount(1);
  await expect(scenario.locator('[data-parity-target="config-provider-screens"]')).toHaveText(
    'screens: sm,md,lg,xl',
  );
  expect(runtimeErrors).toEqual([]);
});

test('ConfigProvider RTL、Locale、Consumer、嵌套上下文与断点行为一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'config-provider',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('config-provider').targets).toHaveLength(5);
  for (const target of assertScenarioComparable('config-provider').targets) {
    await expectComparableTarget(pair, 'config-provider', target.id);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const scenario = parityPage.locator('[data-parity-scenario="config-provider"]');
    await expect(scenario.locator('.config-provider-scenario > .semi-rtl')).toHaveCount(1);
    await expect(scenario.locator('[data-parity-target="config-provider-screens"]')).toHaveText(
      'screens: sm,md,lg,xl',
    );
  }

  const reactCopy = pair.react.page.getByRole('button', { name: 'Copy' });
  const vueCopy = pair.vue.page.getByRole('button', { name: 'Copy' });
  await Promise.all([reactCopy.press('Enter'), vueCopy.press('Enter')]);
  await Promise.all([
    expect(pair.react.page.locator('[data-parity-target="config-provider-locale"]')).toContainText(
      'Copied',
    ),
    expect(pair.vue.page.locator('[data-parity-target="config-provider-locale"]')).toContainText(
      'Copied',
    ),
  ]);

  const narrowViewport = PARITY_VIEWPORTS.narrow;
  await Promise.all([
    pair.react.page.setViewportSize(narrowViewport),
    pair.vue.page.setViewportSize(narrowViewport),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('[data-parity-target="config-provider-screens"]')).toHaveText(
      'screens: xs',
    ),
    expect(pair.vue.page.locator('[data-parity-target="config-provider-screens"]')).toHaveText(
      'screens: xs',
    ),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'narrow'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`ConfigProvider React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'config-provider',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('config-provider-reference');
      const vueTarget = pair.vue.page.getByTestId('config-provider-vue');
      await expect(reactTarget).toHaveScreenshot(
        `config-provider-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`config-provider-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot(),
        vueTarget.screenshot(),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    });
  }
}
