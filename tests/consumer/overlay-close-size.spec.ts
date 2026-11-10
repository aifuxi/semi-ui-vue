import type { Locator } from '@playwright/test';
import { expect, test } from './fixtures';

/** 以浏览器计算尺寸验证按钮方形点击区域与内部独立图形。 */
async function expectCloseSize(button: Locator, size: number, iconSize: number): Promise<void> {
  await expect(button).toHaveCSS('width', `${size}px`);
  await expect(button).toHaveCSS('height', `${size}px`);
  await expect(button.locator('.semi-icon')).toHaveCSS('font-size', `${iconSize}px`);
  await expect(button.locator('svg')).toHaveCSS('width', `${iconSize}px`);
  await expect(button.locator('svg')).toHaveCSS('height', `${iconSize}px`);
}

// 默认行为与公开尺寸定制在明暗主题下都必须成立，Modal 两个分支分别验证。
for (const kind of ['modal', 'modal-no-title', 'side-sheet']) {
  for (const mode of ['light', 'dark']) {
    // 每个用例使用新页面，避免全局默认或上一个弹层泄漏状态。
    test(`${kind}/${mode} 真实包关闭按钮独立尺寸、鼠标与键盘关闭`, async ({
      page,
      packedConsumer,
    }) => {
      /** 默认 24/16 保留；仅放大图形仍是 24/20；显式 default 达到 32/20。 */
      const cases = [
        ['', '', 24, 16],
        ['undefined', '', 24, 16],
        ['', 'prop', 24, 20],
        ['default', '', 32, 16],
        ['default', 'prop', 32, 20],
        ['default', 'slot', 32, 20],
        ['large', 'prop', 40, 20],
      ] as const;
      for (const [size, icon, buttonPixels, iconPixels] of cases) {
        await page.goto(
          `${packedConsumer.url}?overlay-close-size=${kind}&close-icon=${icon}${size ? `&button-size=${size}` : ''}`,
        );
        // 主题通过公开 body 属性设置，不覆盖组件私有样式。
        await page.evaluate((value) => document.body.setAttribute('theme-mode', value), mode);
        /** 同一入口验证鼠标、Enter 和 Esc 三种路径的关闭与重开。 */
        const opener = page.getByRole('button', { name: '打开尺寸示例' });
        /** SideSheet 固定基线没有 close 标签，使用公开兼容 class 定位。 */
        const button = page.locator(
          kind === 'side-sheet' ? '.semi-sidesheet-close' : '.semi-modal-close',
        );
        await opener.click();
        await expect(button).toBeVisible();
        await expectCloseSize(button, buttonPixels, iconPixels);
        await button.click();
        await expect(page.getByRole('dialog')).toHaveCount(0);
        if (kind !== 'side-sheet') await expect(opener).toBeFocused();
        await opener.click();
        await expect(button).toBeVisible();
        await button.focus();
        await page.keyboard.press('Enter');
        await expect(page.getByRole('dialog')).toHaveCount(0);
        if (kind !== 'side-sheet') await expect(opener).toBeFocused();
        await opener.click();
        await expect(button).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(page.getByRole('dialog')).toHaveCount(0);
        if (kind !== 'side-sheet') await expect(opener).toBeFocused();
      }
    });
  }
}

// 窄容器只走公开 width，扩大关闭区域后标题不得侵占按钮。
for (const kind of ['modal', 'side-sheet']) {
  for (const mode of ['light', 'dark']) {
    // 在产品要求的 32/20 配置下，使用 390px 窄视口核对几何。
    test(`${kind}/${mode} 窄容器标题与关闭按钮不重叠`, async ({
      page,
      packedConsumer,
    }, testInfo) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(
        `${packedConsumer.url}?overlay-close-size=${kind}&button-size=default&close-icon=prop&narrow`,
      );
      // 深浅主题共享尺寸契约，确保没有主题特定覆盖导致差异。
      await page.evaluate((value) => document.body.setAttribute('theme-mode', value), mode);
      await page.getByRole('button', { name: '打开尺寸示例' }).click();
      /** 两个实际布局节点，不用 CSS class 存在代替几何结果。 */
      const button = page.locator(kind === 'modal' ? '.semi-modal-close' : '.semi-sidesheet-close');
      /** 标题与关闭按钮分别参与同一 flex header。 */
      const title = page.locator(kind === 'modal' ? '.semi-modal-title' : '.semi-sidesheet-title');
      await expectCloseSize(button, 32, 20);
      // 等待真实入场动效完成，避免在缩放动画中读取瞬间几何。
      await expect(page.locator('[role="dialog"]')).toHaveCSS('animation-name', 'none');
      /** 浏览器最终矩形用来验证标题与操作区的分离。 */
      const titleBox = (await title.boundingBox())!;
      /** 按钮不应被窄容器 flex 压缩或推出可见范围。 */
      const buttonBox = (await button.boundingBox())!;
      expect(titleBox.x + titleBox.width).toBeLessThanOrEqual(buttonBox.x);
      expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(390);
      await page.screenshot({ path: testInfo.outputPath(`${kind}-${mode}-close-size.png`) });
    });
  }
}
