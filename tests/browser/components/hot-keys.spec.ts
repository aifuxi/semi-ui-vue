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
} from '../parity-harness';

test('HotKeys 参考场景来自本地 v2.102.0 公开源码', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'hot-keys',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.hotKeysPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'hot-keys')).toBe(true);
  await expect(page.getByTestId('hot-keys-reference').locator('.semi-hotKeys')).toHaveCount(4);
  await expect(page.locator('[data-parity-target="hot-keys-basic"]')).toContainText(
    'control+shift+k',
  );
  expect(runtimeErrors).toEqual([]);
});

async function dispatchShortcut(
  page: Page,
  selector: string,
  init: {
    altKey?: boolean;
    code: string;
    ctrlKey?: boolean;
    key: string;
    metaKey?: boolean;
    shiftKey?: boolean;
  },
): Promise<boolean> {
  return page.locator(selector).evaluate((element, eventInit) => {
    const event = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      ...eventInit,
    });
    return element.dispatchEvent(event);
  }, init);
}

test('HotKeys React/Vue DOM、状态机、样式与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'hot-keys',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  expect(assertScenarioComparable('hot-keys').targets).toHaveLength(5);
  for (const target of assertScenarioComparable('hot-keys').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'hot-keys', target.id));
  }

  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const status = parityPage.locator('.hot-keys-scenario__status');
    await expect(status).toHaveText('Ready');

    await dispatchShortcut(parityPage, 'body', {
      altKey: true,
      code: 'KeyK',
      ctrlKey: true,
      key: 'k',
      shiftKey: true,
    });
    await expect(status).toHaveText('Ready');
    await dispatchShortcut(parityPage, 'body', {
      code: 'KeyK',
      ctrlKey: true,
      key: 'K',
      shiftKey: true,
    });
    await expect(status).toHaveText('Body Control+Shift+K');

    const defaultAllowed = await dispatchShortcut(parityPage, 'body', {
      code: 'Enter',
      key: 'Enter',
      metaKey: true,
    });
    expect(defaultAllowed).toBe(false);
    await expect(status).toHaveText('Body Meta+Enter');

    await dispatchShortcut(parityPage, '.hot-keys-scenario__target', {
      altKey: true,
      code: 'ArrowDown',
      key: 'ArrowDown',
    });
    await expect(status).toHaveText('Local Alt+ArrowDown');
    await parityPage.locator('[data-parity-target="hot-keys-custom"]').click();
    await expect(status).toHaveText('Custom clicked');
  }

  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`HotKeys React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const pair = await openParityPages(
        context,
        {
          scenarioId: 'hot-keys',
          theme,
          direction: 'ltr',
          locale: 'zh-CN',
        },
        PARITY_VIEWPORTS[viewportName],
      );
      const reactTarget = pair.react.page.getByTestId('hot-keys-reference');
      const vueTarget = pair.vue.page.getByTestId('hot-keys-vue');
      await expect(reactTarget).toHaveScreenshot(`hot-keys-reference-${viewportName}-${theme}.png`);
      await expect(vueTarget).toHaveScreenshot(`hot-keys-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    });
  }
}

test('HotKeys React/Vue RTL 样式与截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'hot-keys',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('[data-parity-target="hot-keys-basic"]')).toHaveCSS(
      'direction',
      'rtl',
    );
  }
  const reactTarget = pair.react.page.getByTestId('hot-keys-reference');
  const vueTarget = pair.vue.page.getByTestId('hot-keys-vue');
  await expect(reactTarget).toHaveScreenshot('hot-keys-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('hot-keys-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
});
