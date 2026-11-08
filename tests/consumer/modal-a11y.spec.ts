import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

/** 按真实文档 IDREF 解析每个标题/正文，不能只检查局部节点的文本。 */
async function expectOwnReferences(page: Page) {
  // 包括所有当前存在的实例，保证每个全局引用都落回自己的 dialog。
  expect(
    await page.locator('[role="dialog"]').evaluateAll(
      // 浏览器实际 ID 解析与辅助技术一致，重复 ID 会指向第一个实例。
      (dialogs) =>
        dialogs.every(
          // 标题、正文都必须存在，并在当前弹窗内部。
          (dialog) =>
            ['aria-labelledby', 'aria-describedby'].every(
              // 检查节点归属，避免同文本内容让错误引用也通过。
              (attribute) => {
                /** 当前 dialog 声明的单个 IDREF。 */
                const id = dialog.getAttribute(attribute);
                return id !== null && dialog.contains(document.getElementById(id));
              },
            ),
        ),
    ),
  ).toBe(true);
}

// 浅色与深色均通过浏览器可访问性计算验证，并保留真实动效。
for (const mode of ['light', 'dark']) {
  // 标准与自定义 header 都必须具有正确名称，且外层允许 Esc。
  for (const customHeader of [false, true]) {
    // 本测试消费新构建的 tarball，不使用 workspace 源码别名。
    test(`真实 tarball 嵌套 Modal 名称、重开、焦点与关闭保护：${mode}/header=${customHeader}`, async ({
      page,
      packedConsumer,
    }) => {
      await page.goto(packedConsumer.url + '?modal-a11y' + (customHeader ? '&custom-header' : ''));
      // 主题只通过公开 body 属性设置，不覆盖组件 CSS。
      await page.evaluate((value) => document.body.setAttribute('theme-mode', value), mode);
      /** 外层与内层使用可访问名称定位，名称错误会直接导致定位失败。 */
      const outer = page.getByRole('dialog', { name: '详情外层', exact: true });
      /** 入口按钮同时用于检查关闭后的焦点回归。 */
      const opener = outer.getByRole('button', { name: '打开操作确认', exact: true });
      /** 内层在关闭与重开后继续用相同语义定位。 */
      const inner = page.getByRole('dialog', { name: '操作确认', exact: true });
      await expect(outer).toBeVisible();
      await opener.click();
      await expect(inner).toBeVisible();
      await expect(inner).toHaveAccessibleDescription('内层正文');
      await expect(inner.getByRole('button', { name: 'cancel', exact: true })).toBeFocused();
      await expectOwnReferences(page);
      // 标准内层保持遮罩关闭保护，不能因点击背景而消失。
      await page
        .locator('.semi-modal-wrap')
        .last()
        .click({ position: { x: 4, y: 4 } });
      await expect(inner).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(inner).toHaveCount(0);
      await expect(outer).toBeVisible();
      await expect(opener).toBeFocused();
      await opener.click();
      await expect(inner).toBeVisible();
      await expectOwnReferences(page);
      await inner.getByRole('button', { name: 'cancel', exact: true }).click();
      await expect(inner).toHaveCount(0);
      await expect(opener).toBeFocused();
      await expect(outer).toBeVisible();
      // 内层退出终态后，外层才重新获得 Esc 所有权。
      await page.keyboard.press('Escape');
      await expect(outer).toHaveCount(0);
    });
  }
}

// 静态方法各建一个 app，验证生产包不会因 useId 重置而复用标题 ID。
test('真实 tarball 多个命令式 Modal 分别命名且 Esc 逐层关闭', async ({ page, packedConsumer }) => {
  await page.goto(packedConsumer.url + '?modal-a11y');
  await page.getByRole('button', { name: '打开命令式弹窗', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(3);
  await expect(page.getByRole('dialog', { name: '详情外层', exact: true })).toBeVisible();
  await expect(
    page.getByRole('dialog', { name: '命令确认', exact: true }),
  ).toHaveAccessibleDescription('命令确认正文');
  await expect(
    page.getByRole('dialog', { name: '命令提示', exact: true }),
  ).toHaveAccessibleDescription('命令提示正文');
  await expectOwnReferences(page);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: '命令提示', exact: true })).toHaveCount(0);
  await expect(page.getByRole('dialog', { name: '命令确认', exact: true })).toBeVisible();
  await expect(page.getByRole('dialog', { name: '详情外层', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: '命令确认', exact: true })).toHaveCount(0);
  await expect(page.getByRole('dialog', { name: '详情外层', exact: true })).toBeVisible();
});

// 菜单项关闭后不再存在，焦点应留在外层而不能退回 BODY。
test('真实 tarball 自定义 header、入口移除与顶层 Esc 保护', async ({ page, packedConsumer }) => {
  await page.goto(
    packedConsumer.url + '?modal-a11y&custom-header&removed-opener&inner-protected&keep-dom',
  );
  /** 使用浏览器计算的可访问名称定位自定义 header 外层。 */
  const outer = page.getByRole('dialog', { name: '详情外层', exact: true });
  /** 内层关闭后保留 DOM，隐藏实例不能继续拥有 Esc。 */
  const inner = page.getByRole('dialog', { name: '操作确认', exact: true });
  await outer.getByRole('button', { name: '打开操作确认', exact: true }).click();
  await expect(inner).toBeVisible();
  await expectOwnReferences(page);
  await page.keyboard.press('Escape');
  await expect(inner).toBeVisible();
  await expect(outer).toBeVisible();
  await inner.getByRole('button', { name: 'cancel', exact: true }).click();
  await expect(inner).toBeHidden();
  // 原入口消失后焦点进入外层仍存在的控件，并继续遵循外层 Tab 陷阱。
  await expect(outer.getByRole('button', { name: '打开命令式弹窗', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(outer.getByRole('button', { name: '打开命令式弹窗', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(outer).toHaveCount(0);
});
