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

async function waitForNotificationAnimations(page: import('@playwright/test').Page): Promise<void> {
  await page.locator('.semi-notification-notice').first().waitFor();
  await page.evaluate(async () => {
    await Promise.all(
      document.getAnimations().map((animation) => animation.finished.catch(() => undefined)),
    );
  });
}

test('Notification 参考场景来自本地 v2.102.0 并保留 wrapper、类型与主题契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'notification',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.notificationPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'notification')).toBe(true);
  await expect(page.locator('.semi-notification-wrapper')).toHaveCount(1);
  await expect(page.locator('.semi-notification-list[placement="topRight"]')).toHaveCount(1);
  await expect(page.getByRole('alert')).toHaveCount(2);
  await expect(page.locator('.notification-scenario__info')).toHaveClass(
    /semi-notification-notice-info/,
  );
  await expect(page.locator('.notification-scenario__warning')).toHaveClass(
    /semi-notification-notice-light/,
  );
  expect(runtimeErrors).toEqual([]);
});

test('Notification React/Vue computed style、几何、ARIA 与键盘关闭一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'notification',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  await Promise.all([
    waitForNotificationAnimations(pair.react.page),
    waitForNotificationAnimations(pair.vue.page),
  ]);
  for (const target of assertScenarioComparable('notification').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'notification', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    const info = page.locator('.notification-scenario__info');
    await expect(info).toHaveAttribute('role', 'alert');
    const labelledBy = await info.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    await expect(page.locator(`[id="${labelledBy}"]`)).toHaveText('任务已完成');
    const close = info.locator('.semi-notification-notice-icon-close');
    await close.focus();
    await expect(close).toBeFocused();
    await close.press('Enter');
    await expect(info).toHaveCount(0);
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Notification React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'notification',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      await Promise.all([
        waitForNotificationAnimations(pair.react.page),
        waitForNotificationAnimations(pair.vue.page),
      ]);
      for (const target of assertScenarioComparable('notification').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'notification', target.id));
      }
      const reactTarget = pair.react.page.locator('.notification-scenario__info');
      const vueTarget = pair.vue.page.locator('.notification-scenario__info');
      await expect(reactTarget).toHaveScreenshot(
        `notification-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`notification-vue-${viewportName}-${theme}.png`);
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

test('Notification React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'notification',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  await Promise.all([
    waitForNotificationAnimations(pair.react.page),
    waitForNotificationAnimations(pair.vue.page),
  ]);
  for (const target of assertScenarioComparable('notification').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'notification', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(page.locator('.semi-notification-list[placement="topLeft"]')).toHaveCount(1);
    await expect(page.locator('.notification-scenario__info')).toHaveCSS('direction', 'rtl');
  }
  const reactTarget = pair.react.page.locator('.notification-scenario__info');
  const vueTarget = pair.vue.page.locator('.notification-scenario__info');
  await expect(reactTarget).toHaveScreenshot('notification-reference-rtl.png');
  await expect(vueTarget).toHaveScreenshot('notification-vue-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
