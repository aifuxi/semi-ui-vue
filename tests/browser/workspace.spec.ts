import { expect, test } from '@playwright/test';
import {
  PARITY_VIEWPORTS,
  REFERENCE_BASELINE,
  VISUAL_THRESHOLDS,
} from '../../packages/test-infra/src';

const harnesses = [
  {
    name: 'React',
    url: 'http://127.0.0.1:4173',
    heading: 'Semi Design React 参考工作台',
  },
  {
    name: 'Vue',
    url: 'http://127.0.0.1:4174',
    heading: 'Semi UI Vue 对照工作台',
  },
] as const;

test('React 与 Vue 工作台在同一 Chromium 上下文中可用', async ({ context }) => {
  const pages = await Promise.all(harnesses.map(() => context.newPage()));

  const results = await Promise.all(
    pages.map(async (page, index) => {
      const harness = harnesses[index];
      expect(harness).toBeDefined();
      if (!harness) throw new Error(`缺少第 ${index} 个工作台配置`);

      const runtimeErrors: string[] = [];
      page.on('pageerror', (error) => runtimeErrors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') runtimeErrors.push(message.text());
      });

      await page.goto(harness.url);
      await expect(page.getByRole('heading', { name: harness.heading })).toBeVisible();
      await expect(page.getByText(REFERENCE_BASELINE.tag, { exact: true })).toBeVisible();
      await expect(page).toHaveTitle(/工作台/);

      const calibration = page.getByTestId('visual-calibration');
      await expect(calibration).toHaveScreenshot(
        `workspace-calibration-${harness.name.toLowerCase()}.png`,
      );

      const rect = await calibration.boundingBox();
      if (!rect) throw new Error(`${harness.name} 校准区域不可见`);

      const computedStyle = await calibration.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          backgroundColor: style.backgroundColor,
          borderRadius: style.borderRadius,
          boxShadow: style.boxShadow,
          display: style.display,
          gap: style.gap,
          height: style.height,
          padding: style.padding,
          width: style.width,
        };
      });

      return {
        computedStyle,
        rect,
        runtimeErrors,
        screenshot: await calibration.screenshot(),
      };
    }),
  );

  const [reactResult, vueResult] = results;
  expect(reactResult).toBeDefined();
  expect(vueResult).toBeDefined();
  if (!reactResult || !vueResult) throw new Error('React/Vue 校准结果不完整');

  expect(reactResult.runtimeErrors).toEqual([]);
  expect(vueResult.runtimeErrors).toEqual([]);
  expect(vueResult.computedStyle).toEqual(reactResult.computedStyle);
  expect(vueResult.screenshot.equals(reactResult.screenshot)).toBe(true);

  for (const axis of ['x', 'y', 'width', 'height'] as const) {
    expect(Math.abs(vueResult.rect[axis] - reactResult.rect[axis])).toBeLessThanOrEqual(
      VISUAL_THRESHOLDS.boundingRectToleranceCssPx,
    );
  }
});

test('React 与 Vue 工作台保留移动视口入口', async ({ context }) => {
  const { width, height, deviceScaleFactor } = PARITY_VIEWPORTS.mobile;
  const pages = await Promise.all(harnesses.map(() => context.newPage()));

  await Promise.all(
    pages.map(async (page, index) => {
      const harness = harnesses[index];
      expect(harness).toBeDefined();
      if (!harness) return;

      await page.setViewportSize({ width, height });
      await page.goto(harness.url);
      await expect(page.getByRole('heading', { name: harness.heading })).toBeVisible();
      expect(await page.evaluate(() => window.devicePixelRatio)).toBe(deviceScaleFactor);
    }),
  );
});
