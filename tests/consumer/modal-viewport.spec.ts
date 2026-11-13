import type { Locator } from '@playwright/test';
import { expect, test } from './fixtures';

/** 检查实际绘制边界；不以 max-width 属性存在代替可见结果。 */
async function expectHorizontalBounds(target: Locator, width: number): Promise<void> {
  /** 原生动效终态后的 CSS 像素矩形。 */
  const box = (await target.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(width);
}

// 深浅模式均覆盖原始 390px 现场、更窄窗口与桌面尺寸兼容。
for (const mode of ['light', 'dark']) {
  for (const width of [390, 320]) {
    // 默认尺寸不传 width；确认与关闭均应留在视口内。
    test(`默认 Modal ${width}px/${mode} 完整显示并保留关闭与回焦`, async ({
      page,
      packedConsumer,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(packedConsumer.url + '?modal-viewport');
      // 仅切换公开主题属性，不给组件添加布局覆盖。
      await page.evaluate((value) => document.body.setAttribute('theme-mode', value), mode);
      /** 打开入口用于验证鼠标和 Esc 关闭后的回焦。 */
      const opener = page.getByRole('button', { name: '打开窄屏弹窗' });
      /** 真实 Portal 中的内容和操作区。 */
      const dialog = page.getByRole('dialog', { name: '窄屏确认' });
      await opener.click();
      await expect(dialog).toHaveCSS('animation-name', 'none');
      await page.screenshot({ path: testInfo.outputPath('modal-viewport.png') });
      await expectHorizontalBounds(dialog, width);
      // 外层可以纵向滚动，但默认弹窗不得引入横向滚动区。
      expect(
        await page.locator('.semi-modal-wrap').evaluate(
          // 测量可滚动内容与容器的实际宽度差，不依靠 overflow:hidden 隐藏问题。
          (element) => element.scrollWidth - element.clientWidth,
        ),
      ).toBe(0);
      for (const name of ['close', 'cancel', 'confirm']) {
        await expectHorizontalBounds(dialog.getByRole('button', { name, exact: true }), width);
      }
      await dialog.getByRole('button', { name: 'close', exact: true }).click();
      await expect(dialog).toHaveCount(0);
      await expect(opener).toBeFocused();
      await opener.click();
      await expect(dialog).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(opener).toBeFocused();
      // 同一实例随窗口恢复桌面宽度后仍使用固定基线的 small=448px。
      await page.setViewportSize({ width: 1280, height: 900 });
      await opener.click();
      await expect(dialog).toHaveCSS('width', '448px');
    });
  }

  // 自动尺寸上限也覆盖 medium/large；显式宽度与全屏保持各自语义。
  test(`Modal 自动尺寸、显式宽度、全屏与局部容器兼容/${mode}`, async ({ page, packedConsumer }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const query of [
      'size=medium',
      'size=large',
      'size=full-width',
      'centered',
      'custom',
      'fullscreen',
      'width=280',
      'width=640',
    ]) {
      await page.goto(packedConsumer.url + '?modal-viewport&' + query);
      // 每个新页面独立设置模式，避免漏测暗色。
      await page.evaluate((value) => document.body.setAttribute('theme-mode', value), mode);
      await page.getByRole('button', { name: '打开窄屏弹窗' }).click();
      /** 默认 dialog 等原生入场动效完成后再测量。 */
      const dialog = page.getByRole('dialog');
      await expect(dialog).toHaveCSS('animation-name', 'none');
      if (query === 'width=640') await expect(dialog).toHaveCSS('width', '640px');
      else {
        await expectHorizontalBounds(dialog, 390);
        if (query === 'custom' || query === 'width=280')
          await expect(dialog).toHaveCSS('width', '280px');
        if (query === 'fullscreen') await expect(dialog).toHaveCSS('width', '390px');
      }
    }
  });

  // 长正文使用原有 wrap 纵向滚动，确认操作能被正常滚入可视区并点击。
  test(`Modal 长内容与居中模式保持操作可达/${mode}`, async ({ page, packedConsumer }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto(packedConsumer.url + '?modal-viewport&long&centered');
    // 主题变化不影响本例的滚动与几何契约。
    await page.evaluate((value) => document.body.setAttribute('theme-mode', value), mode);
    await page.getByRole('button', { name: '打开窄屏弹窗' }).click();
    /** 长标题保持关闭入口在可见宽度内。 */
    const dialog = page.getByRole('dialog');
    await expect(dialog).toHaveCSS('animation-name', 'none');
    await expectHorizontalBounds(dialog.getByRole('button', { name: 'close', exact: true }), 320);
    /** Playwright 的真实点击会先将页尾按钮滚入可视区。 */
    const confirm = dialog.getByRole('button', { name: 'confirm', exact: true });
    await confirm.scrollIntoViewIfNeeded();
    await expectHorizontalBounds(confirm, 320);
    await confirm.click();
    await expect(dialog).toHaveCount(0);
  });
}
