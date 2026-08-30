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

test('Form 参考场景来自本地 v2.102.0 并保留字段、标签、帮助文案与校验', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'form',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.formPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'form')).toBe(true);
  await expect(page.getByTestId('form-reference')).toBeVisible();
  await expect(page.locator('[x-field-id="description"] input')).toHaveValue('Semi Vue');
  await expect(page.locator('.semi-form-field-help-text')).toHaveText('用于识别当前方案');
  await page.getByRole('button', { name: '提交' }).click();
  await expect(page.locator('[x-field-id="name"] .semi-form-field-error-message')).toHaveText(
    '请输入名称',
  );
  expect(runtimeErrors).toEqual([]);
});

test('Form React/Vue 样式、几何、输入、校验与提交同步一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'form',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('form').targets).toHaveLength(5);
  for (const target of assertScenarioComparable('form').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'form', target.id));
  }
  await Promise.all([
    pair.react.page.locator('[data-parity-target="form-name"]').fill('Vue'),
    pair.vue.page.locator('[data-parity-target="form-name"]').fill('Vue'),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('[data-parity-target="form-name"]')).toHaveValue('Vue'),
    expect(pair.vue.page.locator('[data-parity-target="form-name"]')).toHaveValue('Vue'),
  ]);
  await Promise.all([
    pair.react.page.getByRole('button', { name: '提交' }).click(),
    pair.vue.page.getByRole('button', { name: '提交' }).click(),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('.semi-form-field-error-message')).toHaveCount(0),
    expect(pair.vue.page.locator('.semi-form-field-error-message')).toHaveCount(0),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Form React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(
        context,
        { scenarioId: 'form', theme, direction: 'ltr', locale: 'zh-CN' },
        { width: viewport.width, height: viewport.height },
      );
      for (const target of assertScenarioComparable('form').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'form', target.id));
      }
      const [reactForm, vueForm] = await Promise.all([
        pair.react.page.getByTestId('form-reference').screenshot({ animations: 'disabled' }),
        pair.vue.page.getByTestId('form-vue').screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueForm, reactForm, 'Form React/Vue');
      expect(reactForm).toMatchSnapshot(`form-reference-${viewportName}-${theme}.png`);
      expect(vueForm).toMatchSnapshot(`form-vue-${viewportName}-${theme}.png`);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Form React/Vue RTL 方向、几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'form',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('form').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'form', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(page.getByTestId(/form-(reference|vue)/)).toHaveCSS('direction', 'rtl');
  }
  const [reactForm, vueForm] = await Promise.all([
    pair.react.page.getByTestId('form-reference').screenshot({ animations: 'disabled' }),
    pair.vue.page.getByTestId('form-vue').screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueForm, reactForm, 'Form RTL React/Vue');
  expect(reactForm).toMatchSnapshot('form-reference-light-rtl.png');
  expect(vueForm).toMatchSnapshot('form-vue-light-rtl.png');
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
