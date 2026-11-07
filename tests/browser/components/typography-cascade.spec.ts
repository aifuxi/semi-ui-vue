import { expect, test } from '@playwright/test';
import { openParityPages } from '../parity-harness';

// 复用真实 Upload，防止仅比较回退字符串而漏掉 Typography 的 CSS 级联回归。
for (const theme of ['light', 'dark'] as const) {
  /** 组件专用类的字重不能被后加载的普通 Text 规则覆盖。 */
  test(`Typography 不覆盖 Upload 文件名的默认强调：${theme}`, async ({ context }) => {
    const pair = await openParityPages(context, {
      scenarioId: 'upload',
      theme,
      direction: 'ltr',
      locale: 'zh-CN',
    });
    /** 真实文件名是 Typography 与 Upload 专用 class 的共同消费点。 */
    const reactName = pair.react.page.locator('.semi-upload-file-card-info-name').first();
    const vueName = pair.vue.page.locator('.semi-upload-file-card-info-name').first();
    await expect(reactName).toHaveCSS('font-weight', '600');
    await expect(vueName).toHaveCSS('font-weight', '600');
    await vueName.evaluate(
      /** 普通文本主题覆盖仍不能撤销组件已声明的强调字重。 */
      (element) => element.style.setProperty('--semi-typography-font-weight', '300'),
    );
    await expect(vueName).toHaveCSS('font-weight', '600');
  });
}
