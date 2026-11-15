import { expect, test } from './fixtures';

// 两个公开组件、两种受控方式及深浅主题共用同一退场重开契约。
for (const kind of ['tooltip', 'popover'] as const) {
  for (const controlled of [false, true]) {
    for (const theme of ['light', 'dark'] as const) {
      // 保留真实 CSS 动画和原生点击，不先等退场完成再重开。
      test(`${kind}/${theme}/controlled=${controlled} 真实包退场中立即重开`, async ({
        page,
        packedConsumer,
      }, testInfo) => {
        await page.goto(
          `${packedConsumer.url}?popover-repeat&hide=true&popover-kind=${kind}${controlled ? '&controlled' : ''}`,
        );
        await testInfo.attach('packed-consumer-provenance', {
          body: JSON.stringify(packedConsumer.provenance, null, 2),
          contentType: 'application/json',
        });
        // 只切换公开主题属性，保留两个组件各自的默认 role 和样式。
        await page.evaluate((mode) => document.body.setAttribute('theme-mode', mode), theme);
        // 将退场延长到 2 秒以稳定覆盖交互窗口，仍播放真实 CSS，入场使用默认时长。
        await page.addStyleTag({
          content: '.semi-tooltip-animation-hide { animation-duration: 2s !important; }',
        });
        /** 两个组件都由同一个没有业务 toggle 的原生按钮触发。 */
        const trigger = page.getByRole('button', { name: '排序', exact: true });
        /** 用公开兼容 class 检查真实 Portal，不使用测试替身。 */
        const popup = page.locator(`.semi-${kind}-wrapper`);
        await trigger.click();
        await expect(popup).toBeVisible();
        await expect(popup).not.toHaveClass(/semi-tooltip-animation-show/);
        await trigger.click();
        await expect(popup).toHaveClass(/semi-tooltip-animation-hide/);
        await trigger.click();
        await expect(popup).toBeVisible();
        await expect(popup).toHaveClass(new RegExp(`semi-${kind}-wrapper-show`));
        await expect(page.getByTestId('popover-events')).toHaveText('true,false,true');
        await expect(popup).not.toHaveClass(/semi-tooltip-animation-show/);
        await expect(popup).toBeVisible();
        await testInfo.attach('reopened-overlay', {
          body: await page.screenshot(),
          contentType: 'image/png',
        });
        // 后续真正关闭仍应移除 Portal，不能因打断上次退场而留下旧节点。
        await page.getByRole('button', { name: '外部区域', exact: true }).click();
        await expect(popup).toHaveCount(0);
        await expect(page.getByTestId('popover-events')).toHaveText('true,false,true,false');
      });
    }
  }
}
