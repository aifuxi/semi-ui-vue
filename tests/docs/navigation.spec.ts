import { expect, test } from '@playwright/test';

/** 首页侧栏按用户操作挂载，关闭和路由变化都必须撤回移动端遮罩。 */
test('移动端首页导航支持打开、关闭、重开与文档跳转', async ({ page }) => {
  /** 覆盖首页打开导航到完成客户端路由跳转的整个周期。 */
  const errors: string[] = [];
  page.on(
    'pageerror',
    /** 未捕获的客户端异常不能被最终导航成功掩盖。 */
    (error) => errors.push(error.message),
  );
  page.on(
    'console',
    /** Vue 客户端错误可能通过 console.error 报告，也参与验收。 */
    (message) => {
      if (message.type() === 'error') errors.push(message.text());
    },
  );
  // 390×844 为现行文档移动布局的手机竖屏验收尺寸。
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  /** 首页关闭时不挂载侧栏，入口仍须可操作。 */
  const menu = page.getByRole('button', { name: '打开导航', exact: true });
  /** 具名 aside 是导航地标，按实际视口检查其展开和撤回。 */
  const sidebar = page.getByRole('complementary', { name: '文档导航', exact: true });
  /** 遮罩既是关闭入口，也用于确认页面已恢复正常交互。 */
  const close = page.getByRole('button', { name: '关闭导航', exact: true });
  await expect(menu).toBeVisible();
  await expect(sidebar).toHaveCount(0);

  await menu.click();
  await expect(sidebar).toBeInViewport();
  await expect(close).toBeVisible();
  await close.click();
  await expect(sidebar).toHaveCount(0);
  await expect(close).toHaveCount(0);

  await menu.click();
  await expect(sidebar).toBeInViewport();
  await sidebar.getByRole('link', { name: 'Introduction 介绍', exact: true }).click();
  await expect(page).toHaveURL(/\/zh-CN\/start\/introduction$/);
  await expect(page.locator('.header-title')).toHaveText('介绍');
  await expect(sidebar).not.toBeInViewport();
  await expect(close).toHaveCount(0);
  expect(errors).toEqual([]);
});
