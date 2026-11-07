import { expect, test } from '@playwright/test';

/** 文档继续承担公开契约说明，交互编辑由独立工作台的浏览器规格验收。 */
const themeRoute = '/zh-CN/advanced/customize-theme';

/** 默认本地入口必须指向独立端口和路由，不能把工作台重新嵌入文档站。 */
test('主题文档保留 API 与独立工作台入口', async ({ page }) => {
  await page.goto(themeRoute);
  /** 入口是普通外部链接，不依赖文档站内部路由或工作台运行状态。 */
  const entry = page.getByRole('link', { name: '打开主题工作台', exact: true });
  await expect(entry).toHaveAttribute('href', 'http://localhost:4322/#/tokens');
  await expect(entry).toHaveAttribute('target', '_blank');
  await expect(entry).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(page.getByTestId('theme-playground')).toHaveCount(0);
  await expect(page.locator('iframe')).toHaveCount(0);
  // VitePress 标题的可访问名称还包含 permalink 文案，按正文标题前缀定位。
  await expect(page.getByRole('heading', { name: /^品牌颜色生成器/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^CSS 排版主题/ })).toBeVisible();
  await expect(page.locator('#main-content')).toContainText('colorThemeToCss');
  await expect(page.locator('#main-content')).toContainText('--semi-font-size-regular');
  await expect(page.locator('#main-content')).toContainText('不要用生成器重新生成默认主题');
});

/** 手机读者应能从正文访问工作台，静态代码示例不应撑开页面。 */
test('主题文档在移动布局保留可访问入口', async ({ page }) => {
  // 390×844 对应常见手机竖屏，文档允许纵向滚动。
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(themeRoute);
  await expect(page.getByRole('link', { name: '打开主题工作台', exact: true })).toBeVisible();
  expect(
    await page.locator('html').evaluate(
      /** 正文与代码区域不能导致整个页面出现横向溢出。 */
      (element) => element.scrollWidth <= element.clientWidth,
    ),
  ).toBe(true);
});
