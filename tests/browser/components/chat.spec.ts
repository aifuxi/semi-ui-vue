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

async function expectChatReady(page: Page): Promise<void> {
  await expect(page.locator('.chat-scenario .semi-chat')).toHaveCount(1);
  await expect(page.locator('.chat-scenario .semi-chat-chatBox')).toHaveCount(3);
  await expect(page.locator('.chat-scenario .semi-chat-chatBox-content-user')).toHaveCount(1);
  await expect(page.locator('.chat-scenario .semi-chat-inputBox-container')).toHaveCount(1);
  await waitForStableRendering(page);
}

test('Chat 参考场景来自本地 v2.102.0 且无运行时错误', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'chat',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expectChatReady(page);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.chatPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'chat')).toBe(true);
  expect(runtimeErrors).toEqual([]);
});

test('Chat React/Vue 基础 DOM、样式、几何与 hint 受控更新一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'chat',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  await Promise.all([expectChatReady(pair.react.page), expectChatReady(pair.vue.page)]);
  expect(assertScenarioComparable('chat').targets).toHaveLength(4);
  for (const target of assertScenarioComparable('chat').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'chat', target.id));
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await parityPage.locator('.chat-scenario .semi-chat-hint-item').click();
    await expect(parityPage.locator('.chat-scenario .semi-chat-chatBox')).toHaveCount(4);
    await expect(parityPage.locator('.chat-scenario .semi-chat-chatBox').last()).toContainText(
      '继续了解',
    );
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`Chat React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const pair = await openParityPages(
        context,
        { scenarioId: 'chat', theme, direction: 'ltr', locale: 'zh-CN' },
        PARITY_VIEWPORTS[viewportName],
      );
      await Promise.all([expectChatReady(pair.react.page), expectChatReady(pair.vue.page)]);
      const reactTarget = pair.react.page.getByTestId('chat-reference');
      const vueTarget = pair.vue.page.getByTestId('chat-vue');
      await expect(reactTarget).toHaveScreenshot(`chat-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`chat-vue-${viewportName}-${theme}.png`);
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

test('Chat en-US Locale 与 RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'chat',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  await Promise.all([expectChatReady(pair.react.page), expectChatReady(pair.vue.page)]);
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('.chat-scenario .semi-chat')).toHaveCSS('direction', 'rtl');
    await expect(parityPage.locator('.chat-scenario')).toContainText('Assistant');
    await expect(parityPage.locator('.chat-scenario')).toContainText('Learn more');
  }
  const reactTarget = pair.react.page.getByTestId('chat-reference');
  const vueTarget = pair.vue.page.getByTestId('chat-vue');
  await expect(reactTarget).toHaveScreenshot('chat-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('chat-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
