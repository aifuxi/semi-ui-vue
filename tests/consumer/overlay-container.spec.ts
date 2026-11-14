import { expect, test } from './fixtures';

// 明暗模式复用同一零高宿主，验证主题不影响定位及操作可达性。
for (const theme of ['light', 'dark']) {
  for (const kind of ['side-sheet', 'image', 'feedback']) {
    // body 给出可观察对照；Provider 必须保持同一视口位置，explicit 继续相对局部容器。
    test(`真实 tarball ${kind} 容器定位、关闭和重开/${theme}`, async ({
      page,
      packedConsumer,
    }, testInfo) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      /** body 与 Provider 的实际矩形应完全一致，不以 class 或 style 属性代替可见行为。 */
      let bodyBox: { x: number; y: number; width: number; height: number } | null = null;
      /** 记录脚本错误，避免空白页面被当作浮层关闭成功。 */
      const errors: string[] = [];
      // 覆盖本测试的每次页面加载和重开，不清空错误轨迹。
      page.on('pageerror', (error) => errors.push(error.message));
      for (const container of ['body', 'provider', 'explicit']) {
        await page.goto(`${packedConsumer.url}?overlay-container=${kind}&container=${container}`);
        // 主题只使用公开属性，不增加组件私有覆盖。
        await page.evaluate((value) => document.body.setAttribute('theme-mode', value), theme);
        await page.getByRole('button', { name: '打开浮层', exact: true }).click();
        /** 根层承担 fixed/absolute；SideSheet 与 Feedback 的可操作内容是内部 dialog。 */
        const root = page.locator(kind === 'image' ? '.semi-image-preview' : '.semi-sidesheet');
        /** 实际显示和操作的区域，不使用零高度的无 mask SideSheet 外壳。 */
        const dialog = kind === 'image' ? root : root.getByRole('dialog');
        await expect(dialog).toBeVisible();
        await expect(root).toHaveCSS('position', container === 'explicit' ? 'absolute' : 'fixed');
        /** 自定义场景必须真正挂到指定宿主，不能用改挂 body 绕过组织归属。 */
        const host = page.getByTestId('overlay-popup-host');
        await expect(host.locator(':scope > .semi-portal')).toHaveCount(
          container === 'body' ? 0 : 1,
        );
        if (container === 'provider') {
          /** 原问题的核心条件：零高度宿主位于长页面末尾，远离当前视口。 */
          const hostBox = await host.boundingBox();
          expect(hostBox!.height).toBe(0);
          expect(hostBox!.y).toBeGreaterThanOrEqual(1800);
        }
        if (kind === 'image')
          await expect(root.locator('.semi-image-preview-image-img')).toBeVisible();
        /** 操作面板必须完整位于当前 1280×900 视口内。 */
        const box = await dialog.boundingBox();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.y).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(1280);
        expect(box!.y + box!.height).toBeLessThanOrEqual(900);
        if (container === 'body') bodyBox = box;
        else if (container === 'provider') expect(box).toEqual(bodyBox);
        else {
          /** 显式容器继续约束预览/侧栏，防止修复退化成一律 fixed。 */
          const hostBox = await host.boundingBox();
          expect(box!.y).toBeGreaterThanOrEqual(hostBox!.y);
          expect(box!.y + box!.height).toBeLessThanOrEqual(hostBox!.y + hostBox!.height);
        }
        await page.screenshot({ path: testInfo.outputPath(`${kind}-${container}-${theme}.png`) });
        if (kind === 'image') {
          await root.locator('.semi-icon-rotate').click();
          await expect(root.locator('.semi-image-preview-image-img')).toHaveCSS(
            'transform',
            'matrix(0, -1, 1, 0, 0, 0)',
          );
          await root.locator('.semi-image-preview-next').click();
          await expect(root.locator('.semi-image-preview-footer-page')).toHaveText('2/2');
          await root.locator('.semi-image-preview-header-close').click();
        } else if (kind === 'feedback') {
          await dialog.getByPlaceholder('反馈内容').fill('容器中的反馈内容');
          await dialog.getByRole('button', { name: '提交', exact: true }).click();
        } else {
          await dialog.getByRole('button', { name: '保存并关闭', exact: true }).click();
        }
        await expect(root).toHaveCount(0);
        await page.getByRole('button', { name: '打开浮层', exact: true }).click();
        await expect(dialog).toBeVisible();
        if (kind === 'image') await root.locator('.semi-image-preview-header-close').click();
        else if (kind === 'feedback')
          await dialog.getByRole('button', { name: '取消', exact: true }).click();
        else await dialog.locator('.semi-sidesheet-close').click();
        await expect(root).toHaveCount(0);
      }
      expect(errors).toEqual([]);
    });
  }
}
