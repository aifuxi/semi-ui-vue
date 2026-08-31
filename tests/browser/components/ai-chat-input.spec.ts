import { expect, test, type Page } from '@playwright/test';
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
  waitForStableRendering,
} from '../parity-harness';

async function expectAIChatInputReady(page: Page): Promise<void> {
  await expect(page.locator('.ai-chat-input-scenario .semi-aiChatInput')).toHaveCount(1);
  await expect(page.locator('.ai-chat-input-scenario .ProseMirror')).toContainText(
    'Semi UI Vue parity',
  );
  await expect(page.locator('.ai-chat-input-scenario .semi-aiChatInput-reference')).toHaveCount(1);
  await expect(page.locator('.ai-chat-input-scenario .semi-aiChatInput-attachment')).toHaveCount(1);
  await waitForStableRendering(page);
}

test('AIChatInput 参考场景来自本地 v2.102.0 且无运行时错误', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'ai-chat-input',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expectAIChatInputReady(page);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.aiChatInputPublicEntry,
  );
  expect(referenceSourceWasRequested(requestedUrls, 'ai-chat-input')).toBe(true);
  expect(runtimeErrors).toEqual([]);
});

test('AIChatInput React/Vue 基础 DOM、样式、几何与交互一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'ai-chat-input',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  await Promise.all([
    expectAIChatInputReady(pair.react.page),
    expectAIChatInputReady(pair.vue.page),
  ]);
  expect(assertScenarioComparable('ai-chat-input').targets).toHaveLength(4);
  for (const target of assertScenarioComparable('ai-chat-input').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'ai-chat-input', target.id));
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const editor = parityPage.locator('.ai-chat-input-scenario .ProseMirror');
    await editor.click();
    await editor.press('ControlOrMeta+A');
    await editor.fill('Send parity message');
    await parityPage.locator('.semi-aiChatInput-footer-action-send').click();
    await editor.click();
    await editor.press('ControlOrMeta+A');
    await editor.press('Backspace');
    await expect(editor).toHaveText('');
    await editor.press('/');
    await expect(parityPage.locator('.semi-aiChatInput-skill-item')).toContainText('联网搜索');
    await parityPage.locator('.semi-aiChatInput-skill-item').dispatchEvent('click');
    await expect(editor.locator('.skill-slot')).toContainText('联网搜索');
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`AIChatInput React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const pair = await openParityPages(
        context,
        { scenarioId: 'ai-chat-input', theme, direction: 'ltr', locale: 'zh-CN' },
        PARITY_VIEWPORTS[viewportName],
      );
      await Promise.all([
        expectAIChatInputReady(pair.react.page),
        expectAIChatInputReady(pair.vue.page),
      ]);
      const reactTarget = pair.react.page.getByTestId('ai-chat-input-reference');
      const vueTarget = pair.vue.page.getByTestId('ai-chat-input-vue');
      await expect(reactTarget).toHaveScreenshot(
        `ai-chat-input-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`ai-chat-input-vue-${viewportName}-${theme}.png`);
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

test('AIChatInput en-US Locale 与 RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'ai-chat-input',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  await Promise.all([
    expectAIChatInputReady(pair.react.page),
    expectAIChatInputReady(pair.vue.page),
  ]);
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('.semi-aiChatInput')).toHaveCSS('direction', 'rtl');
  }
  const reactTarget = pair.react.page.getByTestId('ai-chat-input-reference');
  const vueTarget = pair.vue.page.getByTestId('ai-chat-input-vue');
  await expect(reactTarget).toHaveScreenshot('ai-chat-input-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('ai-chat-input-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
