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

test('Popconfirm 参考场景来自本地 v2.102.0 并保留 Portal、按钮与箭头契约', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'popconfirm',
      theme: 'light',
      direction: 'ltr',
      locale: 'en-US',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.popconfirmPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'popconfirm')).toBe(true);
  await expect(
    page.getByTestId('popconfirm-reference').locator(':scope > .semi-portal'),
  ).toHaveCount(2);
  await expect(page.locator('.semi-popconfirm')).toHaveCount(2);
  await expect(page.locator('.semi-popconfirm-popover')).toHaveCount(2);
  await expect(page.locator('.semi-popover-icon-arrow')).toHaveCount(1);
  await expect(
    page.locator('.popconfirm-scenario__default .semi-popconfirm-btn-close'),
  ).toHaveCount(1);
  await expect(page.locator('.popconfirm-scenario__danger .semi-popconfirm-btn-close')).toHaveCount(
    0,
  );
  expect(runtimeErrors).toEqual([]);
});

test('Popconfirm React/Vue computed style、几何、scroll、ARIA、键盘与焦点一致', async ({
  context,
}) => {
  const pair = await openParityPages(context, {
    scenarioId: 'popconfirm',
    theme: 'light',
    direction: 'ltr',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('popconfirm').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'popconfirm', target.id));
  }
  const pages = [pair.react.page, pair.vue.page];
  const captureDefaultTop = (page: (typeof pair.react)['page']) =>
    page
      .locator('.popconfirm-scenario__default')
      .evaluate((element) => element.getBoundingClientRect().top);
  const initialTops = await Promise.all(pages.map(captureDefaultTop));
  await Promise.all(
    pages.map((page) =>
      page.getByTestId(/popconfirm-(?:reference|vue)/).evaluate((host) => {
        const trigger = host.querySelector<HTMLElement>(
          '[data-parity-target="popconfirm-trigger-default"]',
        );
        if (!trigger) throw new Error('Popconfirm trigger missing');
        trigger.style.transform = 'translateY(12px)';
        host.dispatchEvent(new Event('scroll'));
      }),
    ),
  );
  await Promise.all(
    pages.map((page, index) =>
      expect
        .poll(async () => (await captureDefaultTop(page)) - initialTops[index]!)
        .toBeCloseTo(12, 0),
    ),
  );
  await Promise.all(
    pages.map((page) =>
      page.evaluate(() => {
        const trigger = document.querySelector<HTMLElement>(
          '[data-parity-target="popconfirm-trigger-default"]',
        );
        if (!trigger) throw new Error('Popconfirm trigger missing');
        trigger.style.transform = 'translateY(20px)';
        document.dispatchEvent(new Event('scroll'));
      }),
    ),
  );
  await Promise.all(
    pages.map((page, index) =>
      expect
        .poll(async () => (await captureDefaultTop(page)) - initialTops[index]!)
        .toBeCloseTo(20, 0),
    ),
  );
  const finalTops = await Promise.all(pages.map(captureDefaultTop));
  expect(finalTops[1]).toBeCloseTo(finalTops[0]!, 5);
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(page.getByRole('dialog')).toHaveCount(2);
    const trigger = page.locator('[data-parity-target="popconfirm-trigger-default"]');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    const cancel = page.locator('.popconfirm-scenario__default [data-type="cancel"]');
    await cancel.focus();
    await expect(cancel).toBeFocused();
    await cancel.press('Enter');
    await expect(page.locator('.popconfirm-scenario__default')).toHaveCount(0);
    await expect(trigger).not.toBeFocused();
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Popconfirm React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(
        context,
        {
          scenarioId: 'popconfirm',
          theme,
          direction: 'ltr',
          locale: 'en-US',
        },
        { width: viewport.width, height: viewport.height },
      );
      for (const target of assertScenarioComparable('popconfirm').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'popconfirm', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('popconfirm-reference');
      const vueTarget = pair.vue.page.getByTestId('popconfirm-vue');
      await expect(reactTarget).toHaveScreenshot(
        `popconfirm-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`popconfirm-vue-${viewportName}-${theme}.png`);
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

test('Popconfirm React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'popconfirm',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('popconfirm').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'popconfirm', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(page.locator('.semi-popconfirm-rtl')).toHaveCount(2);
    await expect(page.locator('.popconfirm-scenario__default')).toHaveCSS('direction', 'rtl');
    await expect(
      page.locator('.semi-popconfirm-popover:has(.popconfirm-scenario__default)'),
    ).toHaveAttribute('x-placement', 'bottomRight');
  }
  const reactTarget = pair.react.page.getByTestId('popconfirm-reference');
  const vueTarget = pair.vue.page.getByTestId('popconfirm-vue');
  await expect(reactTarget).toHaveScreenshot('popconfirm-reference-rtl.png');
  await expect(vueTarget).toHaveScreenshot('popconfirm-vue-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
