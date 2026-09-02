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

test('Feedback 参考场景来自本地 v2.102.0 并保留 popup、Portal 与默认提交门禁', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'feedback',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.feedbackPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'feedback')).toBe(true);
  const stage = page.getByTestId('feedback-reference');
  await expect(stage.locator(':scope > .semi-portal')).toHaveCount(1);
  await expect(stage.locator('.semi-sidesheet-mask')).toHaveCount(0);
  await expect(stage.locator('.semi-feedback-emoji-item')).toHaveCount(3);
  await expect(stage.getByRole('button', { name: '提交' })).toBeDisabled();
  expect(runtimeErrors).toEqual([]);
});

test('Feedback React/Vue 表情、文本原因、提交关闭与 modal 单选行为一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'feedback',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('feedback').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'feedback', target.id));
  }

  for (const page of [pair.react.page, pair.vue.page]) {
    const stage = page.locator('.feedback-scenario__stage');
    await stage.locator('.semi-feedback-emoji-item').first().click();
    await expect(stage.locator('textarea')).toHaveAttribute(
      'placeholder',
      'Provider additional feedback(optional)',
    );
    await expect(stage.getByRole('button', { name: '提交' })).toBeEnabled();
    await stage.locator('textarea').fill('入口不够明显');
    await expect(page.getByRole('status')).toContainText('入口不够明显');
    await stage.getByRole('button', { name: '提交' }).click();
    await expect(stage.locator('[data-parity-target="feedback-basic"]')).toHaveCount(0);

    await page.locator('[data-action="open-feedback-modal"]').click();
    await expect(stage.getByRole('dialog')).toBeVisible();
    await expect(stage.locator('[aria-label="confirm"]')).toBeDisabled();
    await stage.getByText('响应速度较慢', { exact: true }).click();
    await expect(stage.locator('[aria-label="confirm"]')).toBeEnabled();
    await stage.locator('.semi-modal-close').click();
    await expect(stage.getByRole('dialog')).toHaveCount(0);
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Feedback React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'feedback',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);
      await Promise.all(
        [pair.react.page, pair.vue.page].map((page) =>
          page.locator('.feedback-scenario__stage').evaluate((element) => {
            element.scrollIntoView({ block: 'center' });
          }),
        ),
      );
      for (const target of assertScenarioComparable('feedback').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'feedback', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('feedback-reference');
      const vueTarget = pair.vue.page.getByTestId('feedback-vue');
      await expect(reactTarget).toHaveScreenshot(`feedback-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`feedback-vue-${viewportName}-${theme}.png`);
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

test('Feedback React/Vue RTL 几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'feedback',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const target of assertScenarioComparable('feedback').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'feedback', target.id));
  }
  await Promise.all(
    [pair.react.page, pair.vue.page].map((page) =>
      expect(page.locator('[data-parity-target="feedback-basic"]')).toHaveCSS('direction', 'rtl'),
    ),
  );
  const reactTarget = pair.react.page.getByTestId('feedback-reference');
  const vueTarget = pair.vue.page.getByTestId('feedback-vue');
  await expect(reactTarget).toHaveScreenshot('feedback-reference-rtl.png');
  await expect(vueTarget).toHaveScreenshot('feedback-vue-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
