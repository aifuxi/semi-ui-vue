import { expect, test, type BrowserContext } from '@playwright/test';

import {
  expectScreenshotPixelsToMatch,
  openParityPages,
  waitForStableRendering,
} from '../parity-harness';

/** 两端都从真实场景读取 query，生产构建与开发预览使用相同入口。 */
async function openReview(
  context: BrowserContext,
  theme: 'light' | 'dark',
  query: Record<string, string>,
) {
  const pair = await openParityPages(context, {
    scenarioId: 'date-picker',
    theme,
    direction: 'ltr',
    locale: 'zh-CN',
  });
  await Promise.all(
    [pair.react.page, pair.vue.page].map(async (page) => {
      const url = new URL(page.url());
      for (const [name, value] of Object.entries(query)) url.searchParams.set(name, value);
      await page.goto(url.href);
      await expect(page.locator('.date-picker-target-popup')).toBeVisible();
      await waitForStableRendering(page);
      await page.mouse.move(0, 0);
    }),
  );
  return pair;
}

/** 仅比较本次真实面板，不写入或更新既有快照指纹。 */
async function expectPanelsEqual(pair: Awaited<ReturnType<typeof openReview>>) {
  const react = pair.react.page.locator('.date-picker-target-popup');
  const vue = pair.vue.page.locator('.date-picker-target-popup');
  const [reactBox, vueBox] = await Promise.all([react.boundingBox(), vue.boundingBox()]);
  expect(reactBox).not.toBeNull();
  expect(vueBox).not.toBeNull();
  expect(vueBox!.width).toBeCloseTo(reactBox!.width, 1);
  expect(vueBox!.height).toBeCloseTo(reactBox!.height, 1);
  const [reactImage, vueImage] = await Promise.all([
    react.screenshot({ animations: 'disabled' }),
    vue.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueImage, reactImage, 'DatePicker 扩展面板');
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
}

for (const theme of ['light', 'dark'] as const) {
  for (const type of [
    'date',
    'dateRange',
    'dateTime',
    'dateTimeRange',
    'month',
    'monthRange',
    'year',
  ]) {
    for (const density of ['default', 'compact']) {
      test(`DatePicker 主题复核七模式面板 ${type}/${density}/${theme}`, async ({ context }) => {
        const pair = await openReview(context, theme, {
          uiReviewType: type,
          uiReviewDensity: density,
        });
        if (density === 'compact' && !['month', 'monthRange', 'year'].includes(type)) {
          for (const { page } of [pair.react, pair.vue]) {
            await expect(page.getByRole('button', { name: 'Previous year' }).first()).toHaveClass(
              /semi-button-size-small/,
            );
          }
        }
        await expectPanelsEqual(pair);
      });
    }
  }

  test(`DatePicker 年月范围滚动列与选择 ${theme}`, async ({ context }) => {
    const pair = await openReview(context, theme, { uiReviewType: 'monthRange' });
    for (const { page } of [pair.react, pair.vue]) {
      const columns = page.locator('.date-picker-target-popup .semi-scrolllist-item');
      await expect(columns).toHaveCount(4);
      await expect(columns.nth(3).locator('li').first()).toHaveClass(
        /semi-scrolllist-item-disabled/,
      );
      await columns.nth(3).locator('li').nth(6).click();
      await expect(page.locator('[data-parity-target="date-picker-trigger"] input')).toHaveValue(
        '2024-05 ~ 2024-07',
      );
      // 选择会启动真实滚动动画；等待选中行到达列中心，再比较终态像素。
      await expect
        .poll(() =>
          columns.nth(3).evaluate((column) => {
            const selected = column.querySelector('.semi-scrolllist-item-sel');
            if (!selected) return false;
            const outer = column.getBoundingClientRect();
            const item = selected.getBoundingClientRect();
            return Math.abs(item.top + item.height / 2 - outer.top - outer.height / 2) <= 0.5;
          }),
        )
        .toBe(true);
      await page.mouse.move(0, 0);
    }
    await expectPanelsEqual(pair);
  });

  test(`DatePicker 范围内嵌输入保留左右焦点 ${theme}`, async ({ context }) => {
    const pair = await openReview(context, theme, {
      uiReviewType: 'dateTimeRange',
      uiReviewState: 'inset',
    });
    for (const { page } of [pair.react, pair.vue]) {
      const inputs = page.locator('.semi-datepicker-inset-input-wrapper input');
      await expect(inputs).toHaveCount(4);
      await expect(inputs.nth(0)).toBeFocused();
      await inputs.nth(2).focus();
      await expect(inputs.nth(2)).toBeFocused();
      await expect(page.getByRole('gridcell', { name: '2024-05-09', exact: true })).toHaveAttribute(
        'aria-disabled',
        'true',
      );
      await inputs.nth(0).focus();
      await expect(inputs.nth(0)).toBeFocused();
      await expect(page.getByRole('gridcell', { name: '2024-06-16', exact: true })).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    }
    await expectPanelsEqual(pair);
    // 内嵌输入沿用固定默认 spacing=4，弹层位置也应与触发器关系一致。
    const [reactBox, vueBox] = await Promise.all([
      pair.react.page.locator('.date-picker-target-popup').boundingBox(),
      pair.vue.page.locator('.date-picker-target-popup').boundingBox(),
    ]);
    expect(vueBox!.x).toBeCloseTo(reactBox!.x, 1);
    expect(vueBox!.y).toBeCloseTo(reactBox!.y, 1);
  });

  test(`DatePicker 日期时间切换为真实时间滚动列 ${theme}`, async ({ context }) => {
    const pair = await openReview(context, theme, { uiReviewType: 'dateTime' });
    for (const { page } of [pair.react, pair.vue]) {
      await page.getByRole('button', { name: 'Switch to time panel' }).click();
      await expect(page.locator('.date-picker-target-popup .semi-scrolllist-item')).toHaveCount(3);
      await expect(page.locator('.date-picker-target-popup .semi-timepicker-input')).toHaveCount(0);
      await page.mouse.move(0, 0);
    }
    await expectPanelsEqual(pair);
  });

  test(`DatePicker 年月导航回到日期网格 ${theme}`, async ({ context }) => {
    const pair = await openReview(context, theme, { uiReviewType: 'date' });
    for (const { page } of [pair.react, pair.vue]) {
      await page.locator('.semi-datepicker-navigation-month button').click();
      await expect(page.locator('.date-picker-target-popup .semi-scrolllist-item')).toHaveCount(2);
      await page.mouse.move(0, 0);
    }
    await expectPanelsEqual(pair);
    for (const { page } of [pair.react, pair.vue]) {
      await page.getByRole('button', { name: /返回选择日期/ }).click();
      await expect(page.getByRole('grid')).toBeVisible();
    }
  });
}
