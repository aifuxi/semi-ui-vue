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

test('Modal 参考场景来自本地 v2.102.0 公开源码', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'modal',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(
    page.locator('[data-parity-target="modal-basic"] .semi-modal-content'),
  ).toBeVisible();
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.modalPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'modal')).toBe(true);
  expect(runtimeErrors).toEqual([]);
});

test('Modal React/Vue DOM、交互、computed style 与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'modal',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  const dialogs = [pair.react.page, pair.vue.page].map((page) =>
    page.locator('[data-parity-target="modal-basic"] .semi-modal-content'),
  );
  await Promise.all(dialogs.map((dialog) => expect(dialog).toBeVisible()));
  for (const target of assertScenarioComparable('modal').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'modal', target.id));
  }
  const [reactMaskStyle, vueMaskStyle] = await Promise.all([
    captureComputedStyle(
      pair.react.page.locator('[data-parity-target="modal-basic"] > .semi-modal-mask'),
      ['backgroundColor', 'height', 'position', 'width'],
    ),
    captureComputedStyle(
      pair.vue.page.locator('[data-parity-target="modal-basic"] > .semi-modal-mask'),
      ['backgroundColor', 'height', 'position', 'width'],
    ),
  ]);
  expect(vueMaskStyle).toEqual(reactMaskStyle);
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(page.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    await expect(page.locator('.semi-modal-title')).toHaveText('发布变更');
    await expect(page.locator('.semi-modal-footer button')).toHaveCount(2);
  }

  await Promise.all([
    pair.react.page.keyboard.press('Escape'),
    pair.vue.page.keyboard.press('Escape'),
  ]);
  await Promise.all(dialogs.map((dialog) => expect(dialog).toBeHidden()));
  await Promise.all([
    pair.react.page.locator('[data-action="open-modal"]').click(),
    pair.vue.page.locator('[data-action="open-modal"]').click(),
  ]);
  await Promise.all(dialogs.map((dialog) => expect(dialog).toBeVisible()));
  await Promise.all([
    pair.react.page
      .locator('[data-parity-target="modal-basic"] .semi-modal-wrap')
      .click({ position: { x: 4, y: 4 } }),
    pair.vue.page
      .locator('[data-parity-target="modal-basic"] .semi-modal-wrap')
      .click({ position: { x: 4, y: 4 } }),
  ]);
  await Promise.all(dialogs.map((dialog) => expect(dialog).toBeHidden()));
  await Promise.all([
    expect(pair.react.page.locator('[data-action="open-modal"]')).toBeFocused(),
    expect(pair.vue.page.locator('[data-action="open-modal"]')).toBeFocused(),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Modal React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'modal',
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
          pair.react.page.locator('[data-parity-target="modal-basic"] .semi-modal-content'),
        ).toBeVisible(),
        expect(
          pair.vue.page.locator('[data-parity-target="modal-basic"] .semi-modal-content'),
        ).toBeVisible(),
      ]);
      for (const target of assertScenarioComparable('modal').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'modal', target.id));
      }
      const reactTarget = pair.react.page.locator(
        '[data-parity-target="modal-basic"] .semi-modal-content',
      );
      const vueTarget = pair.vue.page.locator(
        '[data-parity-target="modal-basic"] .semi-modal-content',
      );
      await expect(reactTarget).toHaveScreenshot(`modal-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`modal-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        pair.react.page
          .locator('[data-parity-target="modal-basic"] .semi-modal-body')
          .screenshot({ animations: 'disabled' }),
        pair.vue.page
          .locator('[data-parity-target="modal-basic"] .semi-modal-body')
          .screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Modal React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'modal',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  await Promise.all([
    expect(
      pair.react.page.locator('[data-parity-target="modal-basic"] .semi-modal-content'),
    ).toBeVisible(),
    expect(
      pair.vue.page.locator('[data-parity-target="modal-basic"] .semi-modal-content'),
    ).toBeVisible(),
  ]);
  await expect(
    pair.react.page.locator('[data-parity-target="modal-basic"] .semi-modal-footer'),
  ).toHaveScreenshot('modal-reference-rtl.png');
  await expect(
    pair.vue.page.locator('[data-parity-target="modal-basic"] .semi-modal-footer'),
  ).toHaveScreenshot('modal-vue-rtl.png');
  for (const target of assertScenarioComparable('modal').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'modal', target.id));
  }
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    pair.react.page
      .locator('[data-parity-target="modal-basic"] .semi-modal-body')
      .screenshot({ animations: 'disabled' }),
    pair.vue.page
      .locator('[data-parity-target="modal-basic"] .semi-modal-body')
      .screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
