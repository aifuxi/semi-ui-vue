import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { compilePinnedComponentStyles } from '../packages/theme-default/vite-plugin.ts';

/** 实际执行预览入口的虚拟样式加载，防止有所有者的依赖被共享去重后无人载入。 */
it('Storybook 的实际样式入口保留图标依赖与组件覆盖顺序', async () => {
  const plugin = compilePinnedComponentStyles();
  /** 读取实际预览 import 列表，不能在测试里另写一份正确依赖。 */
  const source = readFileSync(
    new URL('../apps/storybook-vue/src/preview-styles.ts', import.meta.url),
    'utf8',
  );
  const imports = [...source.matchAll(/import '(virtual:[^']+)';/g)];
  const styles = [];
  for (const [, specifier] of imports) {
    /** 插件当前使用普通 resolveId/load hook；上下文不参与本地文件编译。 */
    const id = await plugin.resolveId.call({}, specifier);
    styles.push(await plugin.load.call({}, id));
  }
  // 核对原先未进入预览的图标尺寸、旋转及文字间距。
  const css = styles.join('\n');
  expect(
    /\.semi-button\.semi-button-loading \.semi-button-content > svg[^}]+width: 16px;[^}]+height: 16px;/.test(
      css,
    ),
  ).toBe(true);
  expect(css.includes('animation: 600ms linear infinite semi-animation-rotate;')).toBe(true);
  expect(/\.semi-button-content-left\s*\{[^}]*margin-right: 8px;/.test(css)).toBe(true);
  expect(css.includes('.semi-button.semi-button-with-icon-only.semi-button-size-small')).toBe(true);
  // 同一特异性的工具栏按钮规则必须位于基础 Button 后面，不能被导入顺序反向覆盖。
  const buttonRule = css.search(/^\.semi-button\s*\{/m);
  const sidebarRule = css.search(/^\.semi-sidebar-file-menu-bar-btn-codeblock\s*\{/m);
  expect(buttonRule).toBeGreaterThanOrEqual(0);
  expect(sidebarRule).toBeGreaterThan(buttonRule);
});
