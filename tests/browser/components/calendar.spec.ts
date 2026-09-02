import { expect, test } from '@playwright/test';
import {
  assertScenarioComparable,
  createParityScenarioUrl,
  PARITY_VIEWPORTS,
  REFERENCE_SOURCE_PATHS,
  VISUAL_THRESHOLDS,
} from '../../../packages/test-infra/src';
import {
  captureComparableGeometry,
  captureComputedStyle,
  expectComparableTarget,
  expectComparableGeometry,
  expectScreenshotPixelsToMatch,
  openParityPages,
  PARITY_APPLICATIONS,
  referenceSourceWasRequested,
  waitForStableRendering,
  waitForTargetStable,
} from '../parity-harness';

test('Calendar 参考场景来自本地 v2.102.0 并保留周视图与事件 DOM', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'calendar',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.calendarPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'calendar')).toBe(true);
  const scenario = page.getByTestId('calendar-reference');
  await expect(scenario.locator('.semi-calendar-week')).toHaveCount(1);
  await expect(scenario.locator('.semi-calendar-week-header li')).toHaveCount(7);
  await expect(scenario.locator('.semi-calendar-time-item')).toHaveCount(24);
  await expect(scenario.locator('.semi-calendar-event-day')).toHaveCount(2);
  await expect(scenario.locator('.semi-calendar-event-allday')).toHaveCount(2);
  await expect(scenario.locator('.semi-calendar-all-day-tag')).toContainText('全天');
  expect(runtimeErrors).toEqual([]);
});

test('Calendar React/Vue 四种模式、事件、Locale、样式与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'calendar',
    theme: 'light',
    direction: 'ltr',
    locale: 'en-US',
  });
  expect(assertScenarioComparable('calendar').targets).toHaveLength(6);
  const [reactScroll, vueScroll] = await Promise.all([
    pair.react.page.locator('[data-parity-target="calendar-root"]').evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      scrollTop: element.scrollTop,
    })),
    pair.vue.page.locator('[data-parity-target="calendar-root"]').evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      scrollTop: element.scrollTop,
    })),
  ]);
  expect(vueScroll).toEqual(reactScroll);
  for (const target of assertScenarioComparable('calendar').targets) {
    await expectComparableTarget(pair, 'calendar', target.id);
  }
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const scenario = parityPage.locator('[data-parity-scenario="calendar"]');
    await expect(scenario.locator('.semi-calendar-event-day')).toHaveCount(2);
    await expect(scenario.locator('.semi-calendar-event-allday')).toHaveCount(2);
    await expect(scenario.locator('.semi-calendar-all-day-tag')).toContainText('All Day');
  }

  const reactGrid = pair.react.page
    .locator('.semi-calendar-week-scroll .semi-calendar-grid')
    .nth(1);
  const vueGrid = pair.vue.page.locator('.semi-calendar-week-scroll .semi-calendar-grid').nth(1);
  await Promise.all([
    reactGrid.click({ position: { x: 20, y: 80 } }),
    vueGrid.click({ position: { x: 20, y: 80 } }),
  ]);
  const [reactStatus, vueStatus] = await Promise.all([
    pair.react.page.getByRole('status').textContent(),
    pair.vue.page.getByRole('status').textContent(),
  ]);
  expect(vueStatus).toBe(reactStatus);
  expect(reactStatus).toMatch(/^日期：2023-04-\d{2}T/);

  for (const mode of ['day', 'range', 'month'] as const) {
    await Promise.all([
      pair.react.page.locator(`button[data-mode="${mode}"]`).click(),
      pair.vue.page.locator(`button[data-mode="${mode}"]`).click(),
    ]);
    await Promise.all([
      expect(pair.react.page.locator(`[data-parity-target="calendar-root"]`)).toHaveClass(
        new RegExp(`semi-calendar-${mode === 'range' ? 'week' : mode}`),
      ),
      expect(pair.vue.page.locator(`[data-parity-target="calendar-root"]`)).toHaveClass(
        new RegExp(`semi-calendar-${mode === 'range' ? 'week' : mode}`),
      ),
    ]);
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('.semi-calendar-month')).toHaveAttribute('role', 'grid');
    await expect(parityPage.locator('.semi-calendar-month [role="columnheader"]')).toHaveCount(7);
  }
  const reactMore = pair.react.page.locator('.semi-calendar-month-event-card-wrapper').first();
  const vueMore = pair.vue.page.locator('.semi-calendar-month-event-card-wrapper').first();
  await Promise.all([expect(reactMore).toBeVisible(), expect(vueMore).toBeVisible()]);
  await Promise.all([reactMore.click(), vueMore.click()]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-calendar-month-event-card')).toBeVisible(),
    expect(pair.vue.page.locator('.semi-calendar-month-event-card')).toBeVisible(),
  ]);
  const reactCard = pair.react.page.locator(
    '.semi-popover-wrapper:has(.semi-calendar-month-event-card)',
  );
  const vueCard = pair.vue.page.locator(
    '.semi-popover-wrapper:has(.semi-calendar-month-event-card)',
  );
  await Promise.all([waitForTargetStable(reactCard), waitForTargetStable(vueCard)]);
  await Promise.all([
    waitForStableRendering(pair.react.page),
    waitForStableRendering(pair.vue.page),
  ]);
  const [reactCardStyle, vueCardStyle, reactCardGeometry, vueCardGeometry] = await Promise.all([
    captureComputedStyle(reactCard, [
      'backgroundColor',
      'borderRadius',
      'boxShadow',
      'paddingBottom',
      'paddingLeft',
      'paddingRight',
      'paddingTop',
    ]),
    captureComputedStyle(vueCard, [
      'backgroundColor',
      'borderRadius',
      'boxShadow',
      'paddingBottom',
      'paddingLeft',
      'paddingRight',
      'paddingTop',
    ]),
    captureComparableGeometry(reactCard),
    captureComparableGeometry(vueCard),
  ]);
  expect(vueCardStyle).toEqual(reactCardStyle);
  expectComparableGeometry(vueCardGeometry, reactCardGeometry, 'calendar/month-event-card');
  await expect(reactCard).toHaveScreenshot('calendar-month-card-reference-light-en-US.png', {
    animations: 'disabled',
  });
  await expect(vueCard).toHaveScreenshot('calendar-month-card-vue-light-en-US.png', {
    animations: 'disabled',
  });
  const [reactCardScreenshot, vueCardScreenshot] = await Promise.all([
    reactCard.screenshot({ animations: 'disabled' }),
    vueCard.screenshot({ animations: 'disabled' }),
  ]);
  expect(reactCardScreenshot.byteLength).toBeGreaterThan(0);
  await expect(vueCardScreenshot).toMatchSnapshot('calendar-month-card-reference-light-en-US.png', {
    threshold: VISUAL_THRESHOLDS.screenshotThreshold,
    maxDiffPixelRatio: VISUAL_THRESHOLDS.maxDiffPixelRatio,
  });
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toContainText('更多：10/4'),
    expect(pair.vue.page.getByRole('status')).toContainText('更多：10/4'),
  ]);
  await Promise.all([
    pair.react.page.locator('.semi-calendar-month-event-card-close').click(),
    pair.vue.page.locator('.semi-calendar-month-event-card-close').click(),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-calendar-month-event-card')).toBeHidden(),
    expect(pair.vue.page.locator('.semi-calendar-month-event-card')).toBeHidden(),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Calendar React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'calendar',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      const reactTarget = pair.react.page.getByTestId('calendar-reference');
      const vueTarget = pair.vue.page.getByTestId('calendar-vue');
      await expect(reactTarget).toHaveScreenshot(
        `calendar-reference-${viewportName}-${theme}.png`,
        { animations: 'disabled' },
      );
      await expect(vueTarget).toHaveScreenshot(`calendar-vue-${viewportName}-${theme}.png`, {
        animations: 'disabled',
      });
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Calendar React/Vue RTL 与英文 Locale 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'calendar',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('calendar').targets) {
    await expectComparableTarget(pair, 'calendar', target.id);
  }
  const reactTarget = pair.react.page.getByTestId('calendar-reference');
  const vueTarget = pair.vue.page.getByTestId('calendar-vue');
  await expect(reactTarget).toHaveScreenshot('calendar-reference-light-rtl-en-US.png', {
    animations: 'disabled',
  });
  await expect(vueTarget).toHaveScreenshot('calendar-vue-light-rtl-en-US.png', {
    animations: 'disabled',
  });
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
