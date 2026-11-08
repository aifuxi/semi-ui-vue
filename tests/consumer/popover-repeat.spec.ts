import { expect, test } from './fixtures';

// 浅深主题均验证默认动效与无动效，覆盖真实受控和非受控使用方式。
for (const theme of ['light', 'dark']) {
  for (const controlled of [false, true]) {
    for (const motion of [true, false]) {
      // 直接消费 tarball，以严格事件轨迹防止“DOM 暂时隐藏但模型重开”的假通过。
      test(`真实 tarball Popover 重复点击与键盘关闭：${theme}/controlled=${controlled}/motion=${motion}`, async ({
        page,
        packedConsumer,
      }) => {
        await page.goto(
          packedConsumer.url +
            '?popover-repeat&hide=true' +
            (controlled ? '&controlled' : '') +
            (motion ? '' : '&no-motion'),
        );
        // 主题只通过公开 body 属性切换。
        await page.evaluate((mode) => document.body.setAttribute('theme-mode', mode), theme);
        /** 实际鼠标点击由浏览器产生完整事件序列。 */
        const trigger = page.getByRole('button', { name: '排序', exact: true });
        /** Portal 内真实面板，不使用业务 v-if 隐藏。 */
        const popup = page.locator('.semi-popover-wrapper');
        await trigger.click();
        await expect(popup).toBeVisible();
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');
        await trigger.click();
        await expect(popup).toHaveCount(0);
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await expect(page.getByTestId('popover-events')).toHaveText('true,false');
        await trigger.click();
        await expect(popup).toBeVisible();
        await popup.getByRole('button', { name: '面板操作', exact: true }).press('Escape');
        await expect(popup).toHaveCount(0);
        await expect(trigger).toBeFocused();
        await trigger.press('Enter');
        await expect(popup).toBeVisible();
        await trigger.press('Enter');
        await expect(popup).toHaveCount(0);
        await trigger.press('Space');
        await expect(popup).toBeVisible();
        await trigger.press('Space');
        await expect(popup).toHaveCount(0);
        await trigger.click();
        await expect(popup).toBeVisible();
        await page.getByRole('button', { name: '外部区域', exact: true }).click();
        await expect(popup).toHaveCount(0);
        await expect(page.getByTestId('popover-events')).toHaveText(
          'true,false,true,false,true,false,true,false,true,false',
        );
      });
    }
  }
  // 默认与显式 false 维持原行为，不能为了修复 true 而改成所有 Popover 都切换。
  for (const hide of ['omitted', 'false']) {
    test(`真实 tarball Popover 默认及 false 保持打开：${theme}/${hide}`, async ({
      page,
      packedConsumer,
    }) => {
      await page.goto(packedConsumer.url + '?popover-repeat&hide=' + hide);
      // 与 true 用例使用同一公开主题入口。
      await page.evaluate((mode) => document.body.setAttribute('theme-mode', mode), theme);
      /** 名称稳定的原生触发器，不带消费侧监听。 */
      const trigger = page.getByRole('button', { name: '排序', exact: true });
      await trigger.click();
      await expect(page.locator('.semi-popover-wrapper')).toBeVisible();
      await trigger.click();
      await expect(page.locator('.semi-popover-wrapper')).toBeVisible();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await expect(page.getByTestId('popover-events')).toHaveText('true');
      await page.getByRole('button', { name: '外部区域', exact: true }).click();
      await expect(page.locator('.semi-popover-wrapper')).toHaveCount(0);
      await expect(page.getByTestId('popover-events')).toHaveText('true,false');
    });
  }
}
