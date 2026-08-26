import { expect, test } from '@playwright/test';
import {
  createParityScenarioUrl,
  PARITY_VIEWPORTS,
  REFERENCE_SOURCE_PATHS,
} from '../../packages/test-infra/src';
import {
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

test('Vue 侧对未实现的 Button 场景保持 pending，不产生伪对照结果', async ({ context }) => {
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
    'pending',
  );
  await expect(pair.vue.page.getByTestId('vue-scenario-pending')).toBeVisible();
  await expect(pair.vue.page.locator('.semi-button')).toHaveCount(0);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Button React 基线截图：${viewportName}/${theme}`, async ({ page }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(
        createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
          scenarioId: 'button-types',
          theme,
          direction: 'ltr',
          locale: 'zh-CN',
        }),
      );

      await expect(page.getByTestId('button-types-reference')).toHaveScreenshot(
        `button-types-reference-${viewportName}-${theme}.png`,
      );
    });
  }
}
