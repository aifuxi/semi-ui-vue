import { expect, test } from '@playwright/test';

/** 主题文档同时包含 TS、CSS、Vue 和 JS 围栏，覆盖本次暴露问题的真实消费页。 */
const route = '/zh-CN/advanced/customize-theme';

// 两个模式来自文档站公开切换入口，与 Shiki 的双主题配置对应。
for (const mode of ['light', 'dark'] as const) {
  /** 两种模式分别验收 Shiki 高亮、块级排版和复制入口，不能仅检查 span 已生成。 */
  test(`${mode} 模式的文档围栏显示高亮和完整代码块`, async ({ page }) => {
    await page.goto(route);
    if (mode === 'dark') await page.getByRole('button', { name: '切换到暗色模式' }).click();
    /** 首段导入代码由配置中的 github-light/github-dark 主题生成。 */
    const block = page.locator('.vp-adaptive-theme').first();
    /** import 的预期色来自固定的 GitHub 双模式主题，不从当前计算样式复制。 */
    const keyword = block
      .locator('.line span')
      .filter({ hasText: /^import$/ })
      .first();
    await expect(keyword).toHaveCSS(
      'color',
      mode === 'dark' ? 'rgb(249, 117, 131)' : 'rgb(215, 58, 73)',
    );
    await expect(block.locator('pre')).toHaveCSS('padding', '40px 16px 16px');
    await expect(block.locator('code')).toHaveCSS('display', 'block');
    await expect(block.locator('code')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(block.getByRole('button', { name: '复制代码' })).toBeVisible();

    // 同一页动态切换后必须立即使用另一套颜色，无需刷新。
    await page
      .getByRole('button', { name: mode === 'dark' ? '切换到亮色模式' : '切换到暗色模式' })
      .click();
    await expect(keyword).toHaveCSS(
      'color',
      mode === 'dark' ? 'rgb(215, 58, 73)' : 'rgb(249, 117, 131)',
    );
  });
}

/** 复制按钮继续使用 VitePress 行为，并验证键盘可达、反馈和真实剪贴板内容。 */
test('代码块复制按钮可聚焦并复制完整源码', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(route);
  /** 第一个围栏包含多行 import，复制结果必须保持换行。 */
  const block = page.locator('.vp-adaptive-theme').first();
  /** 使用文本内容作为原始源码，不包含工具栏语言或按钮文案。 */
  const source = await block.locator('code').innerText();
  /** 默认名称与可见文字一致，复制后的反馈会变成「已复制」，故保留稳定的按钮定位。 */
  const copy = block.locator('button.copy');
  await expect(copy).toHaveAccessibleName('复制代码');
  await expect(copy).toHaveAttribute('title', '复制代码');
  await copy.focus();
  await expect(copy).toBeFocused();
  await expect(copy).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(copy).toHaveClass(/copied/);
  expect(
    await page.evaluate(
      /** 读取浏览器真实剪贴板，确认按钮没有只显示成功状态。 */
      () => navigator.clipboard.readText(),
    ),
  ).toBe(source.trimEnd());
});

/** 窄屏仍保留代码留白和操作区域；长行只能撑开代码内部滚动区。 */
test('手机代码块局部滚动且工具栏不重叠', async ({ page }) => {
  // 390×844 为项目既有手机竖屏视口。
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(route);
  /** 颜色生成器含长导入行，用真实文档验证横向滚动。 */
  const block = page.locator('.vp-adaptive-theme').last();
  await block.scrollIntoViewIfNeeded();
  expect(
    await page.locator('html').evaluate(
      /** 文档根节点不得被代码长行撑宽。 */
      (element) => element.scrollWidth <= element.clientWidth,
    ),
  ).toBe(true);
  /** 工具栏和代码正文分别有自己的位置，不随 pre 的横向滚动移动。 */
  const copy = await block.locator('button.copy').boundingBox();
  /** 语言标签由 VitePress 生成。 */
  const language = await block.locator('.lang').boundingBox();
  /** 首行正文应位于工具栏之下。 */
  const code = await block.locator('code').boundingBox();
  expect(copy!.width).toBeGreaterThanOrEqual(52);
  expect(copy!.height).toBeGreaterThanOrEqual(28);
  expect(language!.x + language!.width).toBeLessThan(copy!.x);
  expect(copy!.y + copy!.height).toBeLessThanOrEqual(code!.y);
});

/** 旧示例仍走 Prism；站点修复不能污染组件预览或丢失展开源码的高亮。 */
test('示例源码与正文围栏共存且保持 Prism 高亮', async ({ page }) => {
  await page.goto('/zh-CN/basic/button');
  /** 可运行示例初始折叠，打开后才生成 Prism token。 */
  const live = page.locator('.demo-block[data-demo-kind="live"]').first();
  await live.locator('summary').click();
  await expect(live.locator('code .token.tag').first()).toBeVisible();
  await expect(live.locator('pre')).toHaveCSS('padding', '16px');
  await expect(live.locator('pre')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(live.locator('.demo-block-preview .semi-button').first()).toHaveCSS(
    'font-size',
    '14px',
  );
  await page.getByRole('button', { name: '切换到暗色模式' }).click();
  await expect(live.locator('pre')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(live.locator('code .token.tag').first()).toBeVisible();
});
