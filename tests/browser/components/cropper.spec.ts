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

async function waitForCropperScenario(page: import('@playwright/test').Page): Promise<void> {
  await expect(page.locator('.cropper-scenario .semi-cropper-img')).toHaveCount(2);
  await page.locator('.cropper-scenario .semi-cropper-img').evaluateAll(async (images) => {
    await Promise.all(
      images.map((image) => {
        const element = image as HTMLImageElement;
        if (element.complete && element.naturalWidth > 0) return Promise.resolve();
        return new Promise<void>((resolve, reject) => {
          element.addEventListener('load', () => resolve(), { once: true });
          element.addEventListener('error', () => reject(new Error('Cropper image load failed')), {
            once: true,
          });
        });
      }),
    );
  });
  await expect(
    page.locator('[data-parity-target="cropper-basic"] .semi-cropper-box-corner'),
  ).toHaveCount(8);
  await expect(
    page.locator('[data-parity-target="cropper-round"] .semi-cropper-box-corner'),
  ).toHaveCount(4);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
}

test('Cropper 参考场景来自本地 v2.102.0 公开源码', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'cropper',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await waitForCropperScenario(page);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.cropperPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'cropper')).toBe(true);
  expect(runtimeErrors).toEqual([]);
});

test('Cropper React/Vue 几何、滚轮与拖动行为一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'cropper',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  await Promise.all([
    waitForCropperScenario(pair.react.page),
    waitForCropperScenario(pair.vue.page),
  ]);
  for (const target of assertScenarioComparable('cropper').targets) {
    await expectComparableTarget(pair, 'cropper', target.id);
  }

  const reactRoot = pair.react.page.locator('[data-parity-target="cropper-basic"] > .semi-cropper');
  const vueRoot = pair.vue.page.locator('[data-parity-target="cropper-basic"] > .semi-cropper');
  await Promise.all([
    reactRoot.dispatchEvent('wheel', { clientX: 180, clientY: 110, deltaY: -1 }),
    vueRoot.dispatchEvent('wheel', { clientX: 180, clientY: 110, deltaY: -1 }),
  ]);
  const [reactZoomStyle, vueZoomStyle] = await Promise.all([
    reactRoot.locator('.semi-cropper-img').getAttribute('style'),
    vueRoot.locator('.semi-cropper-img').getAttribute('style'),
  ]);
  expect(vueZoomStyle).toBe(reactZoomStyle);

  const [reactMask, vueMask] = [
    reactRoot.locator('.semi-cropper-mask'),
    vueRoot.locator('.semi-cropper-mask'),
  ];
  const [reactBox, vueBox] = await Promise.all([reactMask.boundingBox(), vueMask.boundingBox()]);
  if (!reactBox || !vueBox) throw new Error('Cropper mask is not measurable');
  await pair.react.page.mouse.move(reactBox.x + 80, reactBox.y + 80);
  await pair.vue.page.mouse.move(vueBox.x + 80, vueBox.y + 80);
  await Promise.all([pair.react.page.mouse.down(), pair.vue.page.mouse.down()]);
  await pair.react.page.mouse.move(reactBox.x + 100, reactBox.y + 92);
  await pair.vue.page.mouse.move(vueBox.x + 100, vueBox.y + 92);
  await Promise.all([pair.react.page.mouse.up(), pair.vue.page.mouse.up()]);
  const [reactDragStyle, vueDragStyle] = await Promise.all([
    reactRoot.locator('.semi-cropper-img').getAttribute('style'),
    vueRoot.locator('.semi-cropper-img').getAttribute('style'),
  ]);
  expect(vueDragStyle).toBe(reactDragStyle);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Cropper React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'cropper',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      await Promise.all([
        waitForCropperScenario(pair.react.page),
        waitForCropperScenario(pair.vue.page),
      ]);
      for (const target of assertScenarioComparable('cropper').targets) {
        await expectComparableTarget(pair, 'cropper', target.id);
      }
      const reactTarget = pair.react.page.getByTestId('cropper-reference');
      const vueTarget = pair.vue.page.getByTestId('cropper-vue');
      await expect(reactTarget).toHaveScreenshot(`cropper-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`cropper-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(
        pair.react.page,
        vueScreenshot,
        reactScreenshot,
        `Cropper React/Vue ${viewportName}/${theme}`,
      );
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Cropper React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'cropper',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  await Promise.all([
    waitForCropperScenario(pair.react.page),
    waitForCropperScenario(pair.vue.page),
  ]);
  for (const target of assertScenarioComparable('cropper').targets) {
    await expectComparableTarget(pair, 'cropper', target.id);
  }
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    pair.react.page.getByTestId('cropper-reference').screenshot({ animations: 'disabled' }),
    pair.vue.page.getByTestId('cropper-vue').screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(
    pair.react.page,
    vueScreenshot,
    reactScreenshot,
    'Cropper React/Vue RTL',
  );
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
