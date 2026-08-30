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

test('Input 参考场景来自本地 v2.102.0 并保留 Input/Group/TextArea DOM', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'input',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.inputPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'input')).toBe(true);
  const scenario = page.getByTestId('input-reference');
  await expect(scenario.locator('.semi-input-wrapper')).toHaveCount(10);
  await expect(scenario.locator('.semi-input-textarea-wrapper')).toHaveCount(2);
  await expect(scenario.locator('.semi-input-modebtn')).toHaveCount(1);
  await expect(scenario.locator('.semi-input-group[role="group"]')).toHaveCount(1);
  await expect(scenario.locator('.semi-input-textarea-lineNumber-item')).toHaveCount(3);
  await expect(scenario.locator('.input-target-disabled .semi-input')).toBeDisabled();
  expect(runtimeErrors).toEqual([]);
});

test('Input React/Vue 样式、几何、清除、密码键盘与输入事件一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'input',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  for (const target of assertScenarioComparable('input').targets) {
    await test.step(target.id, async () => {
      await expectComparableTarget(pair, 'input', target.id);
    });
  }

  const reactBasic = pair.react.page.locator('.input-target-basic .semi-input');
  const vueBasic = pair.vue.page.locator('.input-target-basic .semi-input');
  await Promise.all([reactBasic.fill('Vue'), vueBasic.fill('Vue')]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近变化：input:Vue'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近变化：input:Vue'),
  ]);

  const reactClearInput = pair.react.page.locator('.input-target-clear .semi-input');
  const vueClearInput = pair.vue.page.locator('.input-target-clear .semi-input');
  await Promise.all([reactClearInput.focus(), vueClearInput.focus()]);
  const reactClear = pair.react.page.locator('.input-target-clear .semi-input-clearbtn');
  const vueClear = pair.vue.page.locator('.input-target-clear .semi-input-clearbtn');
  await Promise.all([expect(reactClear).toBeVisible(), expect(vueClear).toBeVisible()]);
  await Promise.all([reactClear.click(), vueClear.click()]);
  await Promise.all([
    expect(reactClearInput).toHaveValue(''),
    expect(vueClearInput).toHaveValue(''),
    expect(pair.react.page.getByRole('status')).toHaveText('最近变化：clear'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近变化：clear'),
  ]);

  const reactPasswordButton = pair.react.page.locator('.input-target-password .semi-input-modebtn');
  const vuePasswordButton = pair.vue.page.locator('.input-target-password .semi-input-modebtn');
  await Promise.all([reactPasswordButton.focus(), vuePasswordButton.focus()]);
  await Promise.all([
    pair.react.page.keyboard.press('Enter'),
    pair.vue.page.keyboard.press('Enter'),
  ]);
  await Promise.all([
    expect(pair.react.page.locator('.input-target-password .semi-input')).toHaveAttribute(
      'type',
      'text',
    ),
    expect(pair.vue.page.locator('.input-target-password .semi-input')).toHaveAttribute(
      'type',
      'text',
    ),
  ]);

  const reactTextarea = pair.react.page.locator(
    '.input-target-textarea-counter .semi-input-textarea',
  );
  const vueTextarea = pair.vue.page.locator('.input-target-textarea-counter .semi-input-textarea');
  await Promise.all([reactTextarea.fill('同一内容'), vueTextarea.fill('同一内容')]);
  await Promise.all([
    expect(pair.react.page.getByRole('status')).toHaveText('最近变化：textarea:同一内容'),
    expect(pair.vue.page.getByRole('status')).toHaveText('最近变化：textarea:同一内容'),
  ]);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Input React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const viewport = PARITY_VIEWPORTS[viewportName];
      const pair = await openParityPages(context, {
        scenarioId: 'input',
        theme,
        direction: 'ltr',
        locale: 'zh-CN',
      });
      await Promise.all([
        pair.react.page.setViewportSize({ width: viewport.width, height: viewport.height }),
        pair.vue.page.setViewportSize({ width: viewport.width, height: viewport.height }),
      ]);

      const reactTarget = pair.react.page.getByTestId('input-reference');
      const vueTarget = pair.vue.page.getByTestId('input-vue');
      await expect(reactTarget).toHaveScreenshot(`input-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`input-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    });
  }
}

test('Input React/Vue RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'input',
    theme: 'light',
    direction: 'rtl',
    locale: 'zh-CN',
  });
  const reactTarget = pair.react.page.getByTestId('input-reference');
  const vueTarget = pair.vue.page.getByTestId('input-vue');
  await expect(reactTarget).toHaveScreenshot('input-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('input-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
});
