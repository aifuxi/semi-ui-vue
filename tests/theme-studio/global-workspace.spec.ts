import { expect, test } from '@playwright/test';

/** 用一次真实编辑验证下一绘制帧已更新全部面板，避免把测试结束当作生效时点。 */
test('变量修改在下一绘制帧同步导航、编辑器和预览', async ({ page }, testInfo) => {
  await page.goto('/#/tokens');
  await page.getByRole('textbox', { name: '搜索设计变量', exact: true }).fill('--semi-color-bg-0');
  await page.getByRole('button', { name: '--semi-color-bg-0', exact: true }).click();
  await page.getByRole('textbox', { name: 'CSS 变量值', exact: true }).fill('#fef3c7');
  /** 直接点击 DOM 按钮后等浏览器下一帧，测量不包含 Playwright 的定位和等待开销。 */
  const result = await page.evaluate(async () => {
    /** 起点为用户按下应用按钮。 */
    const start = performance.now();
    /** 按可见文字定位真实提交按钮，不调用应用内部状态。 */
    const apply = [...document.querySelectorAll('button')].find(
      /** 工作台只有一个变量提交入口。 */
      (button) => button.textContent?.trim() === '应用变量',
    )!;
    apply.click();
    // Vue 在下一帧之前完成响应式更新；这里不重试、不固定延时。
    await new Promise<void>(
      /** rAF 对应下一次绘制机会。 */
      (resolve) => requestAnimationFrame(() => resolve()),
    );
    return {
      elapsedMs: performance.now() - start,
      colors: ['.studio-header', '.category-rail', '.studio-editor', '.global-preview'].map(
        /** 四个区域都必须消费同一份实时主题。 */
        (selector) => getComputedStyle(document.querySelector(selector)!).backgroundColor,
      ),
    };
  });
  expect(result.colors).toEqual(Array(4).fill('rgb(254, 243, 199)'));
  await testInfo.attach('下一帧生效耗时', {
    body: JSON.stringify(result),
    contentType: 'application/json',
  });
});

/** 模式入口常驻顶部；路由、编辑器及已打开的默认 Portal 同步切换。 */
test('顶部唯一模式入口切换整个工作台并保留各模式编辑', async ({ page }) => {
  await page.goto('/#/tokens');
  /** 切换开关具备可访问状态，按钮原生支持键盘操作。 */
  const mode = page.getByRole('switch', { name: '全局深色模式', exact: true });
  await expect(mode).toHaveCount(1);
  await expect(page.locator('header')).toContainText('Theme Studio');
  await expect(page.getByTestId('local-scope')).toHaveCount(0);
  await expect(page.getByRole('complementary', { name: '默认主题对照', exact: true })).toHaveCount(
    0,
  );
  await page.getByRole('button', { name: 'global主题提示', exact: true }).click();
  await mode.focus();
  await page.keyboard.press('Space');
  await expect(mode).toBeChecked();
  await expect(page.locator('.studio-shell')).toHaveAttribute('theme-mode', 'dark');
  for (const selector of [
    '.studio-header',
    '.category-rail',
    '.studio-editor',
    '.global-preview',
  ]) {
    await expect(page.locator(selector)).toHaveCSS('background-color', 'rgb(22, 22, 26)');
  }
  await expect(page.getByTestId('global-tooltip-link')).toHaveCSS('color', 'rgb(84, 169, 255)');
  await page.getByRole('button', { name: '关闭提示', exact: true }).click();
  for (const name of ['组件样式定制', '主题预览', '全局样式定制']) {
    await page.getByRole('button', { name, exact: true }).click();
    await expect(mode).toBeChecked();
    await expect(page.locator('.studio-shell')).toHaveAttribute('theme-mode', 'dark');
  }
  await mode.uncheck();
  await expect(page.locator('.studio-header')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
});
