import { expect, test } from '@playwright/test';
import {
  assertScenarioComparable,
  createParityScenarioUrl,
  PARITY_VIEWPORTS,
  REFERENCE_SOURCE_PATHS,
} from '../../../packages/test-infra/src';
import {
  expectComparableTarget,
  openParityPages,
  PARITY_APPLICATIONS,
  referenceSourceWasRequested,
} from '../parity-harness';

test('Upload 参考场景来自本地 v2.102.0 并保留普通与图片文件列表', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'upload',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.uploadPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'upload')).toBe(true);
  const scenario = page.getByTestId('upload-reference');
  await expect(scenario.locator('.semi-upload')).toHaveCount(2);
  await expect(scenario.locator('.semi-upload-file-card')).toHaveCount(2);
  await expect(scenario.locator('.semi-upload-file-card-fail')).toHaveCount(1);
  await expect(scenario.locator('.semi-upload-picture-file-card')).toHaveCount(1);
  await expect(scenario.locator('.semi-upload-picture-add')).toHaveCount(1);
  await expect(scenario.locator('.semi-upload-hidden-input')).toHaveCount(2);
  expect(runtimeErrors).toEqual([]);
});

test('Upload React/Vue DOM、样式、几何、ARIA 与默认开关一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'upload',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  expect(assertScenarioComparable('upload').targets).toHaveLength(7);
  for (const target of assertScenarioComparable('upload').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'upload', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    const scenario = page.locator('.upload-scenario');
    await expect(scenario.locator('.semi-upload-hidden-input')).toHaveCount(2);
    await expect(scenario.locator('.semi-upload-file-list-main').first()).toHaveAttribute(
      'role',
      'list',
    );
    await expect(scenario.locator('.semi-upload-file-list-title-clear')).toContainText('清空');
    await expect(scenario.locator('.semi-upload-file-card-info-retry')).toContainText('重试');
    await expect(scenario.locator('.semi-upload-picture-file-card-pic-info')).toContainText('1');
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Upload React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(
        context,
        {
          scenarioId: 'upload',
          theme,
          direction: 'ltr',
          locale: 'zh-CN',
        },
        { width: viewport.width, height: viewport.height },
      );
      for (const target of assertScenarioComparable('upload').targets) {
        await test.step(target.id, () => expectComparableTarget(pair, 'upload', target.id));
      }
      const reactTarget = pair.react.page.getByTestId('upload-reference');
      const vueTarget = pair.vue.page.getByTestId('upload-vue');
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
      expect(reactScreenshot).toMatchSnapshot(`upload-reference-${viewportName}-${theme}.png`);
      expect(vueScreenshot).toMatchSnapshot(`upload-vue-${viewportName}-${theme}.png`);
      expect(pair.react.runtimeErrors).toEqual([]);
      expect(pair.vue.runtimeErrors).toEqual([]);
    });
  }
}

test('Upload React/Vue RTL 方向、几何与像素一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'upload',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  for (const target of assertScenarioComparable('upload').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'upload', target.id));
  }
  for (const page of [pair.react.page, pair.vue.page]) {
    await expect(page.locator('[data-parity-target="upload-list-root"]')).toHaveCSS(
      'direction',
      'rtl',
    );
  }
  const reactTarget = pair.react.page.getByTestId('upload-reference');
  const vueTarget = pair.vue.page.getByTestId('upload-vue');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  expect(vueScreenshot.equals(reactScreenshot)).toBe(true);
  expect(reactScreenshot).toMatchSnapshot('upload-reference-light-rtl.png');
  expect(vueScreenshot).toMatchSnapshot('upload-vue-light-rtl.png');
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
