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

async function expectAudioPlayerReady(page: Page): Promise<void> {
  await expect(
    page.locator('.audio-player-scenario__main > .semi-audio-player > audio'),
  ).toHaveCount(1);
  await expect(
    page.locator('.audio-player-scenario__main .semi-audio-player-info-time > span').last(),
  ).toHaveText('0:04');
  await expect(
    page.locator('.audio-player-scenario__compact .semi-audio-player-info-title'),
  ).toHaveText('Compact track');
  await page
    .locator('.audio-player-scenario img')
    .first()
    .evaluate(async (image) => {
      const element = image as HTMLImageElement;
      if (!element.complete) await element.decode();
    });
}

test('AudioPlayer 参考场景来自本地 v2.102.0 公开源码', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });

  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'audio-player',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );

  await expectAudioPlayerReady(page);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.audioPlayerPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'audio-player')).toBe(true);
  await expect(
    page.getByTestId('audio-player-reference').locator('div.semi-audio-player'),
  ).toHaveCount(2);
  expect(runtimeErrors).toEqual([]);
});

test('AudioPlayer React/Vue DOM、交互、Portal、样式与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'audio-player',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });

  await Promise.all([
    expectAudioPlayerReady(pair.react.page),
    expectAudioPlayerReady(pair.vue.page),
  ]);
  expect(assertScenarioComparable('audio-player').targets).toHaveLength(5);
  for (const target of assertScenarioComparable('audio-player').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'audio-player', target.id));
  }

  for (const [framework, parityPage] of [
    ['reference', pair.react.page],
    ['vue', pair.vue.page],
  ] as const) {
    const main = parityPage.locator('.audio-player-scenario__main > .semi-audio-player');
    const progressSlider = main.locator('.semi-audio-player-slider-wrapper-horizontal');
    const progressBox = await progressSlider.boundingBox();
    if (!progressBox) throw new Error(`${framework} AudioPlayer 主滑块没有可交互几何`);
    await parityPage.mouse.click(
      progressBox.x + progressBox.width * 0.35,
      progressBox.y + progressBox.height / 2,
    );
    await expect(main.locator('.semi-audio-player-info-time > span').first()).toHaveText('0:01');

    const toolbar = main.locator(':scope > .semi-audio-player-control').nth(1);
    await toolbar.getByRole('button').first().hover();
    await expect(
      parityPage.locator(
        `[data-testid="audio-player-popup-${framework}"] .semi-audio-player-control-volume`,
      ),
    ).toBeVisible();

    await main.locator('.semi-audio-player-control-speed').hover();
    await parityPage
      .locator(`[data-testid="audio-player-popup-${framework}"]`)
      .getByText('1.5x', { exact: true })
      .dispatchEvent('click');
    await expect(main.locator('.semi-audio-player-control-speed')).toHaveText('1.5x');

    await main
      .locator(':scope > .semi-audio-player-control')
      .first()
      .getByRole('button')
      .last()
      .click();
    await expect(main.locator('.semi-audio-player-info-title')).toHaveText('Parity track B');
  }

  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop', 'mobile'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`AudioPlayer React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const pair = await openParityPages(
        context,
        {
          scenarioId: 'audio-player',
          theme,
          direction: 'ltr',
          locale: 'zh-CN',
        },
        PARITY_VIEWPORTS[viewportName],
      );
      await Promise.all([
        expectAudioPlayerReady(pair.react.page),
        expectAudioPlayerReady(pair.vue.page),
      ]);
      const reactTarget = pair.react.page.getByTestId('audio-player-reference');
      const vueTarget = pair.vue.page.getByTestId('audio-player-vue');
      await expect(reactTarget).toHaveScreenshot(
        `audio-player-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`audio-player-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    });
  }
}

test('AudioPlayer React/Vue RTL、英文 Locale 与截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'audio-player',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  await Promise.all([
    expectAudioPlayerReady(pair.react.page),
    expectAudioPlayerReady(pair.vue.page),
  ]);
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    await expect(parityPage.locator('.audio-player-scenario__main > .semi-audio-player')).toHaveCSS(
      'direction',
      'rtl',
    );
    await parityPage
      .locator('.audio-player-scenario__main > .semi-audio-player > .semi-audio-player-control')
      .nth(1)
      .getByRole('button')
      .nth(1)
      .hover();
    await expect(parityPage.getByText('Backward 1s', { exact: true }).last()).toBeVisible();
  }
  const reactTarget = pair.react.page.getByTestId('audio-player-reference');
  const vueTarget = pair.vue.page.getByTestId('audio-player-vue');
  await expect(reactTarget).toHaveScreenshot('audio-player-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('audio-player-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
});
