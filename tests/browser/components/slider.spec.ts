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

test('Slider 参考场景来自本地 v2.102.0 并保留单值、范围、marks、disabled、纵向与 ARIA DOM', async ({
  page,
}) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'slider',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.sliderPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'slider')).toBe(true);
  const scenario = page.getByTestId('slider-reference');
  await expect(scenario.locator('.semi-slider-wrapper')).toHaveCount(5);
  await expect(scenario.locator('[role="slider"]')).toHaveCount(7);
  await expect(scenario.locator('.semi-slider-mark')).toHaveCount(5);
  await expect(scenario.locator('[data-parity-target="slider-disabled"]')).toHaveClass(
    /semi-slider-disabled/,
  );
  await expect(
    scenario.locator('[data-parity-target="slider-vertical"] [role="slider"]'),
  ).toHaveAttribute('aria-orientation', 'vertical');
  expect(runtimeErrors).toEqual([]);
});

test('Slider React/Vue 样式、几何、点击、Tooltip、键盘与真实拖拽一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'slider',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('slider').targets).toHaveLength(5);
  const captureBasicGeometry = async (page: (typeof pair.react)['page']) =>
    page.locator('[data-parity-target="slider-basic"]').evaluate((root) => {
      const selectors = ['.semi-slider-rail', '.semi-slider-track', '.semi-slider-handle'];
      return Object.fromEntries(
        selectors.map((selector) => {
          const element = root.querySelector<HTMLElement>(selector);
          if (!element) throw new Error(`Slider 基础场景缺少 ${selector}`);
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return [
            selector,
            {
              rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
              left: style.left,
              right: style.right,
              width: style.width,
              transform: style.transform,
            },
          ];
        }),
      );
    });
  const [reactBasicGeometry, vueBasicGeometry] = await Promise.all([
    captureBasicGeometry(pair.react.page),
    captureBasicGeometry(pair.vue.page),
  ]);
  expect(vueBasicGeometry).toEqual(reactBasicGeometry);
  for (const target of assertScenarioComparable('slider').targets) {
    await test.step(target.id, async () => {
      await expectComparableTarget(pair, 'slider', target.id);
    });
  }

  const reactBasic = pair.react.page.locator('[data-parity-target="slider-basic"]');
  const vueBasic = pair.vue.page.locator('[data-parity-target="slider-basic"]');
  await Promise.all([
    reactBasic.locator('.semi-slider-rail').click({ position: { x: 400, y: 2 } }),
    vueBasic.locator('.semi-slider-rail').click({ position: { x: 400, y: 2 } }),
  ]);
  const [reactClickedValue, vueClickedValue] = await Promise.all([
    reactBasic.locator('[role="slider"]').getAttribute('aria-valuenow'),
    vueBasic.locator('[role="slider"]').getAttribute('aria-valuenow'),
  ]);
  expect(vueClickedValue).toBe(reactClickedValue);

  await Promise.all([
    reactBasic.locator('[role="slider"]').hover(),
    vueBasic.locator('[role="slider"]').hover(),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-slider-handle-tooltip')).toContainText(
      reactClickedValue ?? '',
    ),
    expect(pair.vue.page.locator('.semi-slider-handle-tooltip')).toContainText(
      vueClickedValue ?? '',
    ),
  ]);

  await Promise.all([
    reactBasic.locator('[role="slider"]').focus(),
    vueBasic.locator('[role="slider"]').focus(),
  ]);
  await Promise.all([
    pair.react.page.keyboard.press('ArrowRight'),
    pair.vue.page.keyboard.press('ArrowRight'),
  ]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText(/最近变化：basic:/),
    expect(pair.vue.page.getByRole('status')).toHaveText(/最近变化：basic:/),
  ]);
  const [reactKeyboardValue, vueKeyboardValue] = await Promise.all([
    reactBasic.locator('[role="slider"]').getAttribute('aria-valuenow'),
    vueBasic.locator('[role="slider"]').getAttribute('aria-valuenow'),
  ]);
  expect(vueKeyboardValue).toBe(reactKeyboardValue);

  const reactRangeHandle = pair.react.page
    .locator('[data-parity-target="slider-range"] [role="slider"]')
    .first();
  const vueRangeHandle = pair.vue.page
    .locator('[data-parity-target="slider-range"] [role="slider"]')
    .first();
  const [reactBox, vueBox] = await Promise.all([
    reactRangeHandle.boundingBox(),
    vueRangeHandle.boundingBox(),
  ]);
  expect(reactBox).not.toBeNull();
  expect(vueBox).not.toBeNull();
  await pair.react.page.mouse.move(
    reactBox!.x + reactBox!.width / 2,
    reactBox!.y + reactBox!.height / 2,
  );
  await pair.react.page.mouse.down();
  await pair.react.page.mouse.move(reactBox!.x + 120, reactBox!.y + reactBox!.height / 2);
  await pair.react.page.mouse.up();
  await pair.vue.page.mouse.move(vueBox!.x + vueBox!.width / 2, vueBox!.y + vueBox!.height / 2);
  await pair.vue.page.mouse.down();
  await pair.vue.page.mouse.move(vueBox!.x + 120, vueBox!.y + vueBox!.height / 2);
  await pair.vue.page.mouse.up();
  const [reactRangeValue, vueRangeValue] = await Promise.all([
    reactRangeHandle.getAttribute('aria-valuenow'),
    vueRangeHandle.getAttribute('aria-valuenow'),
  ]);
  expect(vueRangeValue).toBe(reactRangeValue);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Slider React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'slider',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('slider-reference');
      const vueTarget = pair.vue.page.getByTestId('slider-vue');
      await expect(reactTarget).toHaveScreenshot(`slider-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`slider-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    });
  }
}

test('Slider React/Vue RTL 方向、键盘、几何与截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'slider',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('slider').targets) {
    await expectComparableTarget(pair, 'slider', target.id);
  }
  const reactHandle = pair.react.page.locator(
    '[data-parity-target="slider-basic"] [role="slider"]',
  );
  const vueHandle = pair.vue.page.locator('[data-parity-target="slider-basic"] [role="slider"]');
  await Promise.all([reactHandle.focus(), vueHandle.focus()]);
  await Promise.all([
    pair.react.page.keyboard.press('ArrowLeft'),
    pair.vue.page.keyboard.press('ArrowLeft'),
  ]);
  await Promise.all([
    expect(reactHandle).toHaveAttribute('aria-valuenow', '31'),
    expect(vueHandle).toHaveAttribute('aria-valuenow', '31'),
  ]);
  const reactTooltip = pair.react.page.locator('.semi-slider-handle-tooltip');
  const vueTooltip = pair.vue.page.locator('.semi-slider-handle-tooltip');
  await Promise.all([
    expect(reactTooltip).toHaveCSS('transform', 'none'),
    expect(vueTooltip).toHaveCSS('transform', 'none'),
  ]);
  const captureRtlTooltipGeometry = async (tooltip: typeof reactTooltip) =>
    tooltip.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      };
    });
  const [reactTooltipGeometry, vueTooltipGeometry] = await Promise.all([
    captureRtlTooltipGeometry(reactTooltip),
    captureRtlTooltipGeometry(vueTooltip),
  ]);
  expect(vueTooltipGeometry).toEqual(reactTooltipGeometry);
  const reactTarget = pair.react.page.getByTestId('slider-reference');
  const vueTarget = pair.vue.page.getByTestId('slider-vue');
  await expect(reactTarget).toHaveScreenshot('slider-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('slider-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
});
