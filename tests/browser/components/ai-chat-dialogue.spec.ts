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

async function expectAIChatDialogueReady(page: Page): Promise<void> {
  await expect(page.locator('.ai-chat-dialogue-scenario .semi-ai-chat-dialogue')).toHaveCount(1);
  await expect(
    page.locator('.ai-chat-dialogue-scenario .semi-ai-chat-dialogue-wrapper'),
  ).toHaveCount(3);
  await expect(
    page.locator('.ai-chat-dialogue-scenario .semi-ai-chat-dialogue-content-user'),
  ).toHaveCount(1);
  await expect(
    page.locator('.ai-chat-dialogue-scenario .semi-ai-chat-dialogue-hint-item'),
  ).toHaveCount(1);
  await waitForStableRendering(page);
}

test('AIChatDialogue 参考场景来自本地 v2.102.0 且无运行时错误', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'ai-chat-dialogue',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expectAIChatDialogueReady(page);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.aiChatDialoguePublicEntry,
  );
  await expect
    .poll(() => referenceSourceWasRequested(requestedUrls, 'ai-chat-dialogue'))
    .toBe(true);
  expect(runtimeErrors).toEqual([]);
});

test('AIChatDialogue React/Vue DOM、样式、几何与 hint 受控更新一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'ai-chat-dialogue',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  await Promise.all([
    expectAIChatDialogueReady(pair.react.page),
    expectAIChatDialogueReady(pair.vue.page),
  ]);
  expect(assertScenarioComparable('ai-chat-dialogue').targets).toHaveLength(4);
  for (const target of assertScenarioComparable('ai-chat-dialogue').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'ai-chat-dialogue', target.id));
  }
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await parityPage.locator('.semi-ai-chat-dialogue-hint-item').click();
    await expect(parityPage.locator('.semi-ai-chat-dialogue-wrapper')).toHaveCount(4);
    await expect(parityPage.locator('.semi-ai-chat-dialogue-wrapper').last()).toContainText(
      '继续了解',
    );
  }
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

test('AIChatDialogue 编辑及删除确认关闭原菜单，与固定基线一致', async ({ context }) => {
  for (const theme of ['light', 'dark'] as const) {
    const pair = await openParityPages(context, {
      scenarioId: 'ai-chat-dialogue',
      theme,
      direction: 'ltr',
      locale: 'zh-CN',
    });
    for (const page of [pair.react.page, pair.vue.page]) {
      const url = new URL(page.url());
      url.searchParams.set('dialogueEditor', 'true');
      await page.goto(url.toString());
      await expectAIChatDialogueReady(page);
      const user = page.locator('.semi-ai-chat-dialogue-wrapper').nth(1);
      await user.hover();
      await user.locator('button:has(.semi-icon-edit_stroked)').click();
      await expect(page.locator('.semi-ai-chat-dialogue-content-editing input')).toHaveValue(
        '请介绍 Semi',
      );
      await page.getByRole('button', { name: '取消', exact: true }).click();
      await expect(page.locator('.semi-ai-chat-dialogue-content-editing')).toHaveCount(0);

      await page
        .locator('.semi-ai-chat-dialogue-wrapper button:has(.semi-icon-more_stroked)')
        .last()
        .click();
      const item = page.locator('.semi-ai-chat-dialogue-action-dropdown .semi-dropdown-item');
      await expect(item).toBeVisible();
      await item.click();
      await expect(page.getByRole('dialog', { name: '确认要删除吗？', exact: true })).toBeVisible();
      // 旧实现会让删除菜单留在确认框遮罩上方。
      await expect(item).toBeHidden();
      await expect(page.locator('.semi-modal-confirm-title-text')).toHaveText('确认要删除吗？');
    }
    const [reactScreenshot, vueScreenshot] = await Promise.all([
      pair.react.page
        .getByRole('dialog', { name: '确认要删除吗？', exact: true })
        .screenshot({ animations: 'disabled' }),
      pair.vue.page
        .getByRole('dialog', { name: '确认要删除吗？', exact: true })
        .screenshot({ animations: 'disabled' }),
    ]);
    await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    expect(pair.react.runtimeErrors).toEqual([]);
    expect(pair.vue.runtimeErrors).toEqual([]);
    await Promise.all([pair.react.page.close(), pair.vue.page.close()]);
  }
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`AIChatDialogue React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const pair = await openParityPages(
        context,
        { scenarioId: 'ai-chat-dialogue', theme, direction: 'ltr', locale: 'zh-CN' },
        PARITY_VIEWPORTS[viewportName],
      );
      await Promise.all([
        expectAIChatDialogueReady(pair.react.page),
        expectAIChatDialogueReady(pair.vue.page),
      ]);
      const reactTarget = pair.react.page.getByTestId('ai-chat-dialogue-reference');
      const vueTarget = pair.vue.page.getByTestId('ai-chat-dialogue-vue');
      await expect(reactTarget).toHaveScreenshot(
        `ai-chat-dialogue-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`ai-chat-dialogue-vue-${viewportName}-${theme}.png`);
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

test('AIChatDialogue en-US Locale 与 RTL 截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'ai-chat-dialogue',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  await Promise.all([
    expectAIChatDialogueReady(pair.react.page),
    expectAIChatDialogueReady(pair.vue.page),
  ]);
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('.ai-chat-dialogue-scenario')).toContainText('Assistant');
    await expect(parityPage.locator('.ai-chat-dialogue-scenario')).toContainText('Learn more');
  }
  const reactTarget = pair.react.page.getByTestId('ai-chat-dialogue-reference');
  const vueTarget = pair.vue.page.getByTestId('ai-chat-dialogue-vue');
  await expect(reactTarget).toHaveScreenshot('ai-chat-dialogue-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('ai-chat-dialogue-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});
