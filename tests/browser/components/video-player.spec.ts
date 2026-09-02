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

async function expectVideoPlayerReady(page: Page): Promise<void> {
  const players = page.locator('.video-player-scenario .semi-videoPlayer');
  await expect(players).toHaveCount(2);
  for (const video of await players.locator('video').all()) {
    await video.evaluate((element) => {
      Object.defineProperty(element, 'duration', { configurable: true, value: 4 });
      Object.defineProperty(element, 'currentTime', {
        configurable: true,
        writable: true,
        value: 0,
      });
      element.dispatchEvent(new Event('durationchange'));
      element.dispatchEvent(new Event('timeupdate'));
    });
  }
  await expect(
    page.locator('.video-player-scenario__main .semi-videoPlayer-controls-time'),
  ).toHaveText('00:00 / 00:04');
  await expect(
    page.locator('.video-player-scenario__main .semi-videoPlayer-progress-slider'),
  ).toHaveCount(3);
  await page
    .locator('.video-player-scenario img')
    .first()
    .evaluate(async (image) => {
      const element = image as HTMLImageElement;
      if (!element.complete) await element.decode();
    });
}

test('VideoPlayer 参考场景来自本地 v2.102.0 公开源码', async ({ page }) => {
  const requestedUrls: string[] = [];
  const runtimeErrors: string[] = [];
  page.on('request', (request) => requestedUrls.push(request.url()));
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  await page.goto(
    createParityScenarioUrl(PARITY_APPLICATIONS.react.baseUrl, {
      scenarioId: 'video-player',
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    }),
  );
  await expectVideoPlayerReady(page);
  await expect(page.getByTestId('reference-source')).toHaveText(
    REFERENCE_SOURCE_PATHS.videoPlayerPublicEntry,
  );
  await expect.poll(() => referenceSourceWasRequested(requestedUrls, 'video-player')).toBe(true);
  expect(runtimeErrors).toEqual([]);
});

test('VideoPlayer React/Vue DOM、交互、Portal、样式与几何一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'video-player',
    theme: 'light',
    direction: 'ltr',
    locale: 'zh-CN',
  });
  await Promise.all([
    expectVideoPlayerReady(pair.react.page),
    expectVideoPlayerReady(pair.vue.page),
  ]);
  expect(assertScenarioComparable('video-player').targets).toHaveLength(5);
  for (const target of assertScenarioComparable('video-player').targets) {
    await test.step(target.id, () => expectComparableTarget(pair, 'video-player', target.id));
  }

  for (const [framework, parityPage] of [
    ['reference', pair.react.page],
    ['vue', pair.vue.page],
  ] as const) {
    const player = parityPage.locator('.video-player-scenario__main > .semi-videoPlayer');
    const progress = player.locator('.semi-videoPlayer-progress');
    const progressBox = await progress.boundingBox();
    if (!progressBox) throw new Error(`${framework} VideoPlayer 进度条没有可交互几何`);
    await parityPage.mouse.click(
      progressBox.x + progressBox.width * 0.405,
      progressBox.y + progressBox.height / 2,
    );
    await expect(player.locator('.semi-videoPlayer-controls-time')).toHaveText('00:01 / 00:04');

    await player.locator('.semi-videoPlayer-controls-popup').filter({ hasText: '1.0x' }).hover();
    const popup = parityPage.locator(`[data-testid="video-player-popup-${framework}"]`);
    await popup.getByText('1.5x', { exact: true }).dispatchEvent('click');
    await expect(
      player.locator('.semi-videoPlayer-controls-popup').filter({ hasText: '1.5x' }),
    ).toBeVisible();

    await player.locator('.semi-icon-volume_2').hover();
    await expect(popup.locator('.semi-videoPlayer-controls-volume')).toBeVisible();

    await player.locator('.semi-icon-flip_horizontal').click();
    await expect(player).toHaveClass(/semi-videoPlayer-mirror/);

    const focusButton = player.locator('.semi-videoPlayer-controls-menu-button').first();
    await focusButton.focus();
    await parityPage.keyboard.press('ArrowRight');
    await expect(player.locator('.semi-videoPlayer-controls-time')).toHaveText('00:02 / 00:04');
  }

  expect(pair.react.runtimeErrors).toEqual([]);
  expect(pair.vue.runtimeErrors).toEqual([]);
});

for (const viewportName of ['desktop'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`VideoPlayer React/Vue 基线截图：${viewportName}/${theme}`, async ({ context }) => {
      const pair = await openParityPages(
        context,
        { scenarioId: 'video-player', theme, direction: 'ltr', locale: 'zh-CN' },
        PARITY_VIEWPORTS[viewportName],
      );
      await Promise.all([
        expectVideoPlayerReady(pair.react.page),
        expectVideoPlayerReady(pair.vue.page),
      ]);
      const reactTarget = pair.react.page.getByTestId('video-player-reference');
      const vueTarget = pair.vue.page.getByTestId('video-player-vue');
      await expect(reactTarget).toHaveScreenshot(
        `video-player-reference-${viewportName}-${theme}.png`,
      );
      await expect(vueTarget).toHaveScreenshot(`video-player-vue-${viewportName}-${theme}.png`);
      const [reactScreenshot, vueScreenshot] = await Promise.all([
        reactTarget.screenshot({ animations: 'disabled' }),
        vueTarget.screenshot({ animations: 'disabled' }),
      ]);
      await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
    });
  }
}

test('VideoPlayer React/Vue RTL、英文 Locale 与截图一致', async ({ context }) => {
  const pair = await openParityPages(context, {
    scenarioId: 'video-player',
    theme: 'light',
    direction: 'rtl',
    locale: 'en-US',
  });
  await Promise.all([
    expectVideoPlayerReady(pair.react.page),
    expectVideoPlayerReady(pair.vue.page),
  ]);
  for (const parityPage of [pair.react.page, pair.vue.page]) {
    const player = parityPage.locator('.video-player-scenario__main > .semi-videoPlayer');
    await expect(player).toHaveCSS('direction', 'rtl');
    await player.locator('.semi-icon-flip_horizontal').click();
    await expect(parityPage.getByText('Mirror', { exact: true })).toBeVisible();
  }
  const reactTarget = pair.react.page.getByTestId('video-player-reference');
  const vueTarget = pair.vue.page.getByTestId('video-player-vue');
  await expect(reactTarget).toHaveScreenshot('video-player-reference-light-rtl.png');
  await expect(vueTarget).toHaveScreenshot('video-player-vue-light-rtl.png');
  const [reactScreenshot, vueScreenshot] = await Promise.all([
    reactTarget.screenshot({ animations: 'disabled' }),
    vueTarget.screenshot({ animations: 'disabled' }),
  ]);
  await expectScreenshotPixelsToMatch(pair.react.page, vueScreenshot, reactScreenshot);
});
