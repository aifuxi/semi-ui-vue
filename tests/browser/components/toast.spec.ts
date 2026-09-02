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
  expectScreenshotPixelsToMatch,
  openParityPages,
  PARITY_APPLICATIONS,
  referenceSourceWasRequested,
} from '../parity-harness';

test('Toast 参考场景来自本地 v2.102.0 并保留类型、light、关闭与 alert', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'toast',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await page.locator('.semi-toast').first().waitFor();
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.toastPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'toast')).toBe(true);
  await expect(page.locator('.semi-toast-wrapper')).toHaveCount(1);
  await expect(page.getByRole('alert')).toHaveCount(2);
  await expect(page.locator('.toast-scenario__info')).toHaveClass(/semi-toast-info/);
  await expect(page.locator('.toast-scenario__warning')).toHaveClass(
    /semi-toast-warning.*semi-toast-light|semi-toast-light.*semi-toast-warning/,
  );
  expect(runtimeErrors).toEqual([]);
});

test('Toast React/Vue DOM、样式、几何、ARIA 与关闭行为一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'toast',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('toast').targets).toHaveLength(5);
  for (const target of assertScenarioComparable('toast').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'toast', target.id));
  }
  const [reactRootStyle, vueRootStyle, reactRootRect, vueRootRect] = await Promise.all([
    captureComputedStyle(pair.react.page.locator('.toast-scenario__info'), [
      'direction',
      'transform',
    ]),
    captureComputedStyle(pair.vue.page.locator('.toast-scenario__info'), [
      'direction',
      'transform',
    ]),
    pair.react.page.locator('.toast-scenario__info').boundingBox(),
    pair.vue.page.locator('.toast-scenario__info').boundingBox(),
  ]);
  expect(vueRootStyle).toEqual(reactRootStyle);
  expect(vueRootRect).toEqual(reactRootRect);
  for (const page of [pair.react.page, pair.vue.page]) {
    const info = page.locator('.toast-scenario__info');
    await expect(info).toHaveAttribute('role', 'alert');
    await expect(info).toHaveAttribute('aria-label', 'info type');
    await expect(info.locator('.semi-toast-content-text')).toHaveCSS('max-width', '450px');
    await info.locator('.semi-toast-close-button button').click();
    await expect(info).toHaveCount(0);
    await expect(page.locator('.semi-toast-wrapper')).toHaveCount(1);
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Toast React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(
        context,
        {
          scenarioId: 'toast',
          theme,
          direction: 'ltr',
          locale: 'zh-CN',
        },
        { width: viewport.width, height: viewport.height },
      );
      for (const target of assertScenarioComparable('toast').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'toast', target.id));
      }
      const reactTarget = pair.react.page.locator('.toast-scenario__info .semi-toast-content');
      const vueTarget = pair.vue.page.locator('.toast-scenario__info .semi-toast-content');
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
      expect(reactScreenshot).toMatchSnapshot(`toast-reference-${viewportName}-${theme}.png`);
      expect(vueScreenshot).toMatchSnapshot(`toast-vue-${viewportName}-${theme}.png`);
      const reactWarning = pair.react.page.locator('.toast-scenario__warning .semi-toast-content');
      const vueWarning = pair.vue.page.locator('.toast-scenario__warning .semi-toast-content');
      const [reactWarningScreenshot, vueWarningScreenshot] = await Promise.all([
        reactWarning.screenshot({ animations: 'disabled' }),
        vueWarning.screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(
        pair.react.page,
        vueWarningScreenshot,
        reactWarningScreenshot,
      );
      expect(reactWarningScreenshot).toMatchSnapshot(
        `toast-warning-reference-${viewportName}-${theme}.png`,
      );
      expect(vueWarningScreenshot).toMatchSnapshot(
        `toast-warning-vue-${viewportName}-${theme}.png`,
      );
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Toast React/Vue RTL 文本、几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'toast',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('toast').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'toast', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(page.locator('.toast-scenario__info')).toHaveClass(/semi-toast-rtl/);
    await expect(page.locator('.toast-scenario__info')).toHaveCSS('direction', 'rtl');
    await expect(page.locator('.toast-scenario__info .semi-toast-content-text')).toHaveCSS(
      'text-align',
      'right',
    );
  }
  const reactTarget = pair.react.page.locator('.toast-scenario__info .semi-toast-content');
  const vueTarget = pair.vue.page.locator('.toast-scenario__info .semi-toast-content');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(reactScreenshot).toMatchSnapshot('toast-reference-light-rtl.png');
  expect(vueScreenshot).toMatchSnapshot('toast-vue-light-rtl.png');
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
