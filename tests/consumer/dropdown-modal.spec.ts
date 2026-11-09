import { expect, test } from './fixtures';

// 保留默认动效与无动效两条路径，避免通过动画延迟掩盖键盘默认动作。
for (const motion of [true, false]) {
  // 鼠标对照与两种公开键盘激活均使用同一受控菜单和默认 Modal 焦点。
  for (const activation of ['Enter', 'Space', 'mouse']) {
    // 真实 tarball 与完整 Chromium 会执行 jsdom 缺少的原生默认点击。
    test(`真实 tarball Dropdown 打开 Modal 不意外取消：${activation}/motion=${motion}`, async ({
      page,
      packedConsumer,
    }) => {
      await page.goto(packedConsumer.url + '?dropdown-modal' + (motion ? '' : '&no-motion'));
      /** 真实按钮同时用于重开验证，不调用组件实例方法。 */
      const trigger = page.getByRole('button', { name: '打开管理菜单', exact: true });
      /** Portal 内聚焦菜单项，键盘动作必须从这里产生。 */
      const item = page.getByRole('menuitem', { name: '重命名', exact: true });
      /** 默认取消按钮保留自动聚焦，不能用 autofocus 绕过缺陷。 */
      const dialog = page.getByRole('dialog', { name: '管理表单', exact: true });
      /** 严格回调计数可以发现先关闭后重开之类的假通过。 */
      const state = page.getByTestId('dropdown-modal-state');
      if (activation === 'mouse') await trigger.click();
      else await trigger.press('Enter');
      await expect(item).toBeFocused();
      if (activation === 'mouse') await item.click();
      else await item.press(activation);
      await expect(dialog).toBeVisible();
      await expect(state).toHaveText('actions=1;cancels=0;visible=true');
      await expect(dialog.getByRole('button', { name: 'cancel', exact: true })).toBeFocused();
      await expect(page.getByRole('menu')).toHaveCount(0);
      // 弹窗仍可编辑，证明 Enter 完整按下/松开后没有意外关闭。
      await dialog.getByRole('textbox', { name: '名称', exact: true }).fill('新名称');
      await expect(state).toHaveText('actions=1;cancels=0;visible=true');
      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(state).toHaveText('actions=1;cancels=1;visible=false');
      // 菜单退出与 Modal 退出后可再次操作，显式取消仍只执行一次。
      await trigger.click();
      await item.click();
      await expect(dialog).toBeVisible();
      await expect(state).toHaveText('actions=2;cancels=1;visible=true');
      await dialog.getByRole('button', { name: 'cancel', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await expect(state).toHaveText('actions=2;cancels=2;visible=false');
    });
  }
}
