import { expect, test } from '@playwright/test';

/** 文档继续承担公开契约说明，交互编辑由独立工作台的浏览器规格验收。 */
const themeRoute = '/zh-CN/advanced/customize-theme';

test('未配置公网地址时主题文档隐藏工作台链接并保留公开 API', async ({ page }) => {
  await page.goto(themeRoute);
  const entry = page.getByRole('link', { name: '打开主题工作台', exact: true });
  await expect(entry).toHaveCount(0);
  await expect(page.getByTestId('theme-playground')).toHaveCount(0);
  await expect(page.locator('iframe')).toHaveCount(0);
  // VitePress 标题的可访问名称还包含 permalink 文案，按正文标题前缀定位。
  await expect(page.getByRole('heading', { name: /^品牌颜色生成器/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^CSS 排版主题/ })).toBeVisible();
  await expect(page.locator('#main-content')).toContainText('colorThemeToCss');
  await expect(page.locator('#main-content')).toContainText('--semi-font-size-regular');
  await expect(page.locator('#main-content')).toContainText('不要用生成器重新生成默认主题');
});

test('主题文档的静态代码在移动布局内滚动', async ({ page }) => {
  // 390×844 对应常见手机竖屏，文档允许纵向滚动。
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(themeRoute);
  expect(
    await page.locator('html').evaluate(
      /** 正文与代码区域不能导致整个页面出现横向溢出。 */
      (element) => element.scrollWidth <= element.clientWidth,
    ),
  ).toBe(true);
});
