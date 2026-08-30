import { expect, test } from '@playwright/test';
import {
  assertScenarioComparable,
  createParityScenarioUrl,
  PARITY_VIEWPORTS,
  REFERENCE_SOURCE_PATHS,
  VISUAL_THRESHOLDS,
} from '../../../packages/test-infra/src';
import {
  captureComputedStyle,
  expectComparableTarget,
  openParityPages,
  PARITY_APPLICATIONS,
  referenceSourceWasRequested,
} from '../parity-harness';

async function waitForImageScenario(page: import('@playwright/test').Page): Promise<void> {
  await expect(page.locator('.image-scenario img.semi-image-img')).toHaveCount(3);
  await page.locator('.image-scenario img.semi-image-img').evaluateAll(async (images) => {
    await Promise.all(
      images.map((image) => {
        const element = image as HTMLImageElement;
        if (element.complete && element.naturalWidth > 0) return Promise.resolve();
        return new Promise<void>((resolve, reject) => {
          element.addEventListener('load', () => resolve(), { once: true });
          element.addEventListener('error', () => reject(new Error('Image scenario load failed')), {
            once: true,
          });
        });
      }),
    );
  });
  await expect(page.locator('.image-scenario .semi-image-overlay')).toHaveCount(0);
}

test('Image 参考场景来自本地 v2.102.0 公开源码', async ({ page }) => {
  const requestedUrls: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'image',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await waitForImageScenario(page);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.imagePublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'image')).toBe(true);
  await expect(page.getByTestId('image-reference').locator('.semi-image')).toHaveCount(3);
});

test('Image React/Vue 缩略图与分组预览行为一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'image',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  await Promise.all([waitForImageScenario(pair.react.page), waitForImageScenario(pair.vue.page)]);
  for (const target of assertScenarioComparable('image').targets) {
    await expectComparableTarget(pair, 'image', target.id);
  }
  const [reactClosed, vueClosed] = await Promise.all([
    pair.react.page.getByTestId('image-reference').screenshot({ animations: 'disabled' }),
    pair.vue.page.getByTestId('image-vue').screenshot({ animations: 'disabled' }),
  ]);
  expect(vueClosed.equals(reactClosed)).toBe(true);

  await Promise.all([
    pair.react.page.locator('[data-parity-target="image-group-first"]').click(),
    pair.vue.page.locator('[data-parity-target="image-group-first"]').click(),
  ]);
  const reactPreview = pair.react.page.locator('.semi-image-preview');
  const vuePreview = pair.vue.page.locator('.semi-image-preview');
  await Promise.all([expect(reactPreview).toBeVisible(), expect(vuePreview).toBeVisible()]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-image-preview-header-title')).toHaveText('蓝色山景'),
    expect(pair.vue.page.locator('.semi-image-preview-header-title')).toHaveText('蓝色山景'),
    expect(pair.react.page.locator('.semi-image-preview-footer-page')).toHaveText('1/2'),
    expect(pair.vue.page.locator('.semi-image-preview-footer-page')).toHaveText('1/2'),
  ]);
  await Promise.all([
    pair.react.page.locator('.semi-image-preview-image-img').evaluate(async (image) => {
      const element = image as HTMLImageElement;
      if (element.complete && element.naturalWidth > 0) return;
      await new Promise<void>((resolve) =>
        element.addEventListener('load', () => resolve(), { once: true }),
      );
    }),
    pair.vue.page.locator('.semi-image-preview-image-img').evaluate(async (image) => {
      const element = image as HTMLImageElement;
      if (element.complete && element.naturalWidth > 0) return;
      await new Promise<void>((resolve) =>
        element.addEventListener('load', () => resolve(), { once: true }),
      );
    }),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-image-preview-image-spin')).toHaveCount(0),
    expect(pair.vue.page.locator('.semi-image-preview-image-spin')).toHaveCount(0),
  ]);
  await expect(reactPreview).toHaveScreenshot('image-preview-open-reference.png');
  await expect(vuePreview).toHaveScreenshot('image-preview-open-vue.png');
  await expect(pair.react.page.locator('.semi-image-preview-footer')).toHaveScreenshot(
    'image-preview-footer-reference.png',
  );
  await expect(pair.vue.page.locator('.semi-image-preview-footer')).toHaveScreenshot(
    'image-preview-footer-vue.png',
  );
  const [reactImage, vueImage, reactFooter, vueFooter] = await Promise.all([
    pair.react.page.locator('.semi-image-preview-image-img').screenshot({ animations: 'disabled' }),
    pair.vue.page.locator('.semi-image-preview-image-img').screenshot({ animations: 'disabled' }),
    pair.react.page.locator('.semi-image-preview-footer').screenshot({ animations: 'disabled' }),
    pair.vue.page.locator('.semi-image-preview-footer').screenshot({ animations: 'disabled' }),
  ]);
  expect(vueImage.equals(reactImage)).toBe(true);
  expect(reactFooter.length).toBeGreaterThan(0);
  expect(vueFooter.length).toBeGreaterThan(0);
  for (const selector of [
    '.semi-image-preview-footer',
    '.semi-image-preview-footer-page',
    '.semi-slider',
    '.semi-slider-handle',
  ]) {
    const reactNode = pair.react.page.locator(selector);
    const vueNode = pair.vue.page.locator(selector);
    const [reactStyle, vueStyle, reactRect, vueRect] = await Promise.all([
      captureComputedStyle(reactNode, ['backgroundColor', 'color', 'display', 'lineHeight']),
      captureComputedStyle(vueNode, ['backgroundColor', 'color', 'display', 'lineHeight']),
      reactNode.boundingBox(),
      vueNode.boundingBox(),
    ]);
    expect(vueStyle).toEqual(reactStyle);
    expect(reactRect).not.toBeNull();
    expect(vueRect).not.toBeNull();
    for (const axis of ['x', 'y', 'width', 'height'] as const) {
      expect(Math.abs(vueRect![axis] - reactRect![axis])).toBeLessThanOrEqual(
        VISUAL_THRESHOLDS.boundingRectToleranceCssPx,
      );
    }
  }
  const [reactPreviewStyle, vuePreviewStyle, reactPreviewRect, vuePreviewRect] = await Promise.all([
    captureComputedStyle(reactPreview, ['backgroundColor', 'height', 'position', 'width']),
    captureComputedStyle(vuePreview, ['backgroundColor', 'height', 'position', 'width']),
    reactPreview.boundingBox(),
    vuePreview.boundingBox(),
  ]);
  expect(vuePreviewStyle).toEqual(reactPreviewStyle);
  expect(vuePreviewRect).toEqual(reactPreviewRect);
  expect(await pair.react.page.evaluate(() => document.body.style.overflow)).toBe('hidden');
  expect(await pair.vue.page.evaluate(() => document.body.style.overflow)).toBe('hidden');

  await Promise.all([
    pair.react.page
      .locator('.semi-image-preview-image-img')
      .dispatchEvent('wheel', { deltaY: 100 }),
    pair.vue.page.locator('.semi-image-preview-image-img').dispatchEvent('wheel', { deltaY: 100 }),
  ]);
  const [reactZoom, vueZoom] = await Promise.all([
    pair.react.page.locator('.semi-slider-handle').getAttribute('aria-valuenow'),
    pair.vue.page.locator('.semi-slider-handle').getAttribute('aria-valuenow'),
  ]);
  expect(Number(reactZoom)).toBeCloseTo(490, 8);
  expect(Number(vueZoom)).toBeCloseTo(490, 8);

  await Promise.all([
    pair.react.page.locator('.semi-icon-real_size_stroked').click(),
    pair.vue.page.locator('.semi-icon-real_size_stroked').click(),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-icon-window_adaption_stroked')).toBeVisible(),
    expect(pair.vue.page.locator('.semi-icon-window_adaption_stroked')).toBeVisible(),
  ]);
  await Promise.all([
    pair.react.page.locator('.semi-icon-rotate').click(),
    pair.vue.page.locator('.semi-icon-rotate').click(),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-image-preview-image-img')).toHaveCSS(
      'transform',
      'matrix(0, -1, 1, 0, 0, 0)',
    ),
    expect(pair.vue.page.locator('.semi-image-preview-image-img')).toHaveCSS(
      'transform',
      'matrix(0, -1, 1, 0, 0, 0)',
    ),
  ]);

  await Promise.all([
    pair.react.page.locator('.semi-image-preview-next').click(),
    pair.vue.page.locator('.semi-image-preview-next').click(),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-image-preview-footer-page')).toHaveText('2/2'),
    expect(pair.vue.page.locator('.semi-image-preview-footer-page')).toHaveText('2/2'),
  ]);
  await Promise.all([
    pair.react.page.keyboard.press('Escape'),
    pair.vue.page.keyboard.press('Escape'),
  ]);
  await Promise.all([expect(reactPreview).toHaveCount(0), expect(vuePreview).toHaveCount(0)]);
  expect(await pair.react.page.evaluate(() => document.body.style.overflow)).toBe('');
  expect(await pair.vue.page.evaluate(() => document.body.style.overflow)).toBe('');
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Image React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'image',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      await Promise.all([
        waitForImageScenario(pair.react.page),
        waitForImageScenario(pair.vue.page),
      ]);
      for (const target of assertScenarioComparable('image').targets) {
        await expectComparableTarget(pair, 'image', target.id);
      }
      const reactTarget = pair.react.page.getByTestId('image-reference');
      const vueTarget = pair.vue.page.getByTestId('image-vue');
      await expect(reactTarget).toHaveScreenshot(`image-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`image-vue-${viewportName}-${theme}.png`);
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

test('Image React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'image',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  await Promise.all([waitForImageScenario(pair.react.page), waitForImageScenario(pair.vue.page)]);
  for (const target of assertScenarioComparable('image').targets) {
    await expectComparableTarget(pair, 'image', target.id);
  }
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    pair.react.page.getByTestId('image-reference').screenshot({ animations: 'disabled' }),
    pair.vue.page.getByTestId('image-vue').screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
