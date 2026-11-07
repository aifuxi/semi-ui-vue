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
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'ai-chat-input')).toBe(true);
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

  for (const [framework, parityPage] of [
    ['React', pair.react.page],
    ['Vue', pair.vue.page],
  ] as const) {
    await test.step(`${framework} 发送消息并通过 / 选择技能`, async () => {
      let editor = parityPage.locator('.ai-chat-input-scenario .ProseMirror');
      await editor.fill('Send parity message');
      await parityPage.locator('.semi-aiChatInput-footer-action-send').click();

      await parityPage.reload();
      await expectAIChatInputReady(parityPage);
      editor = parityPage.locator('.ai-chat-input-scenario .ProseMirror');
      await editor.focus();
      await editor.press('ControlOrMeta+A');
      await editor.press('Backspace');
      await expect(editor).toHaveText('');
      await editor.press('/');
      const skillItem = parityPage.locator('.semi-aiChatInput-skill-item');
      await expect(skillItem).toBeVisible();
      await expect(skillItem).toContainText('联网搜索');
      // 默认技能弹层应匹配真实输入框宽度，防止数值 width 在 Vue style 中失效。
      const inputWidth = await parityPage
        .locator('.semi-aiChatInput')
        .evaluate((element) => element.getBoundingClientRect().width);
      await expect(parityPage.locator('.semi-aiChatInput-skill')).toHaveCSS(
        'width',
        `${inputWidth}px`,
      );
      await skillItem.click();
      await expect(editor.locator('.skill-slot')).toContainText('联网搜索');
    });
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('AIChatInput 建议与模板弹层保持输入框宽度和模板图标', async ({ context }) => {
  for (const theme of ['light', 'dark'] as const) {
    const pair = await openParityPages(context, {
      scenarioId: 'ai-chat-input',
      theme,
      direction: 'ltr',
      locale: 'zh-CN',
    });
    for (const page of [pair.react.page, pair.vue.page]) {
      const url = new URL(page.url());
      url.searchParams.set('aiInputPanels', 'true');
      await page.goto(url.toString());
      await expectAIChatInputReady(page);
      await page.locator('[data-action="show-suggestions"]').click();
      await expect(page.locator('.semi-aiChatInput-suggestion-item')).toHaveCount(3);
      const width = await page
        .locator('.semi-aiChatInput')
        .evaluate((element) => element.getBoundingClientRect().width);
      await expect(page.locator('.semi-aiChatInput-suggestion')).toHaveCSS('width', `${width}px`);
      const templateButton = page.locator('.semi-aiChatInput-footer-configure-button');
      // Button 使用 Vue icon slot；误传组件对象 attr 会使图标和按钮宽度一起消失。
      await expect(templateButton.locator('.semi-icon-template_stroked')).toBeVisible();
      await templateButton.click();
      await expect(page.locator('.semi-aiChatInput-template')).toBeVisible();
      await expect(page.locator('.semi-aiChatInput-template')).toHaveCSS('width', `${width}px`);
    }
    const [reactScreenshot, vueScreenshot] = await Promise.all([
      pair.react.page.getByTestId('ai-chat-input-reference').screenshot({ animations: 'disabled' }),
      pair.vue.page.getByTestId('ai-chat-input-vue').screenshot({ animations: 'disabled' }),
    ]);
    await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    for (const page of [pair.react.page, pair.vue.page]) {
      await page.getByRole('button', { name: '使用模板', exact: true }).click();
      await expect(page.locator('.ProseMirror')).toContainText('模板内容');
    }
    expect(pair.react.runtimeErrors).toEqual([]);
    expect(pair.vue.runtimeErrors).toEqual([]);
    await Promise.all([pair.react.page.close(), pair.vue.page.close()]);
  }
});

for (const viewportName of ['desktop'] as const) {
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
