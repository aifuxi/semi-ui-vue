import { expect, test } from '@playwright/test';
import {
  assertScenarioComparable,
  createParityScenarioUrl,
  PARITY_VIEWPORTS,
  REFERENCE_SOURCE_PATHS,
} from '../../../packages/test-infra/src';
import {
  captureComputedStyle,
  createVueScenarioUrl,
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

// 同一宿主条件下比较固定 React：Provider 只改 DOM 位置，显式参数才启用局部定位。
for (const containerMode of ['provider', 'explicit'] as const) {
  // 1280×900 对应缺陷现场，使用相同视口比较固定上游。
  for (const width of [1280]) {
    // 每次使用独立页面，避免既有 Portal 或滚动位置污染首次挂载。
    test(`Modal 自定义容器 ${containerMode}/${width} 对齐定位且按钮可操作`, async ({
      context,
    }, testInfo) => {
      /** 标准对照配置确保主题、方向和 Locale 完全一致。 */
      const pair = await openParityPages(context, {
        scenarioId: 'modal',
        theme: 'light',
        direction: 'ltr',
        locale: 'zh-CN',
      });
      /** 两端始终使用相同 viewport、query 和场景数据。 */
      for (const application of [pair.react, pair.vue]) {
        await application.page.setViewportSize({ width, height: 900 });
        /** 在当前标准路由追加公开场景参数，再以新页面加载触发首次挂载。 */
        const url = new URL(application.page.url());
        url.searchParams.set('modalContainer', containerMode);
        await application.page.goto(url.toString());
        /** 宿主必须真实持有 Portal，禁止通过改挂 body 绕过缺陷。 */
        const host = application.page.getByTestId('modal-popup-host');
        await expect(host.locator(':scope > .semi-portal')).toHaveCount(1);
        await expect(application.page.getByRole('dialog')).toBeVisible();
        /** 局部容器与 Provider 的定位模式来自固定基线源码。 */
        const positioning = containerMode === 'provider' ? 'fixed' : 'absolute';
        await expect(host.locator('.semi-modal-wrap')).toHaveCSS('position', positioning);
        await expect(host.locator('.semi-modal-mask')).toHaveCSS('position', positioning);
        if (containerMode === 'provider') {
          /** 零高、屏幕外宿主是本缺陷触发条件，不应改变弹窗的视口坐标。 */
          const hostBox = await host.boundingBox();
          expect(hostBox?.height).toBe(0);
          expect(hostBox!.y).toBeGreaterThanOrEqual(900);
        }
      }
      // 比较真实计算样式与几何，不以 Vue 自身现状推导预期。
      for (const target of assertScenarioComparable('modal').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'modal', target.id));
      }
      /** 全视口截图保留现场上下文，进入已忽略的测试产物。 */
      await pair.vue.page.screenshot({
        path: testInfo.outputPath(`modal-${containerMode}-${width}.png`),
      });
      // 正常 click 会检查可见、命中与视口可达，不使用 force 或脚本触发事件。
      for (const application of [pair.react, pair.vue]) {
        await application.page.getByRole('button', { name: 'cancel', exact: true }).click();
        await expect(application.page.getByRole('dialog')).toHaveCount(0);
        await application.page.locator('[data-action="open-modal"]').click();
        await application.page.getByRole('button', { name: 'confirm', exact: true }).click();
        await expect(application.page.getByRole('dialog')).toHaveCount(0);
        expect(application.runtimeErrors).toEqual([]);
      }
    });
  }
}

// Vue 已有 maxWidth 窄屏可达性修正与固定 React 的 448px 不同，此处按已记录的契约验证。
test('Modal Provider 零高容器在 390px 窄屏下保留视口定位与页尾可达性', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  /** 使用公开 Storybook 路由和相同零高宿主，独立验证窄视口。 */
  const url = new URL(
    createVueScenarioUrl({
      scenarioId: 'modal',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  url.searchParams.set('modalContainer', 'provider');
  await page.goto(url.toString());
  /** Portal 保留组织宿主，mask 和 wrap 仍采用视口定位。 */
  const host = page.getByTestId('modal-popup-host');
  await expect(host.locator(':scope > .semi-portal')).toHaveCount(1);
  await expect(host.locator('.semi-modal-wrap')).toHaveCSS('position', 'fixed');
  await expect(host.locator('.semi-modal-mask')).toHaveCSS('position', 'fixed');
  await expect(page.getByRole('dialog')).toBeVisible();
  /** 弹窗及页尾必须完全位于当前视口，而非仅存在 DOM。 */
  const box = await page.getByRole('dialog').boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  expect(box!.y).toBe(80);
  expect(box!.y + box!.height).toBeLessThanOrEqual(900);
  await page.getByRole('button', { name: 'cancel', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.locator('[data-action="open-modal"]').click();
  await page.getByRole('button', { name: 'confirm', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
