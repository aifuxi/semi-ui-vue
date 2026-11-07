import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  compileTypographyTheme,
  transformTypographySource,
} from '../packages/theme-default/typography-theme.mjs';

/** 使用主题包锁定的 Sass 版本，避免根工具链的新版 Sass 改变对照结果。 */
const require = createRequire(new URL('../packages/theme-default/package.json', import.meta.url));
/** 原生编译器只用于独立还原固定基线的默认 CSS。 */
const sass = require('sass');
/** 样式入口绝对路径使测试不依赖执行目录。 */
const themeRoot = fileURLToPath(new URL('../packages/theme-default', import.meta.url));

/** 将新增排版变量回退为原声明值，不触碰原有颜色等变量。 */
function restoreFallbacks(source) {
  let result = '';
  let cursor = 0;
  while (cursor < source.length) {
    // CSS var() 允许嵌套，不能用贪婪正则把相邻函数一起替换。
    const start = source.indexOf('var(', cursor);
    if (start < 0) return result + source.slice(cursor);
    result += source.slice(cursor, start);
    let depth = 1;
    let end = start + 4;
    let comma = -1;
    for (; end < source.length && depth > 0; end += 1) {
      if (source[end] === '(') depth += 1;
      else if (source[end] === ')') depth -= 1;
      else if (source[end] === ',' && depth === 1 && comma < 0) comma = end;
    }
    // 只解析本次公开的排版变量，默认颜色变量依然保持原样。
    const token = source.slice(start + 4, comma < 0 ? end - 1 : comma).trim();
    if (comma >= 0 && /^--semi-.*(?:font-|line-height)/.test(token)) {
      result += restoreFallbacks(source.slice(comma + 1, end - 1).trim());
    } else result += source.slice(start, end);
    cursor = end;
  }
  return result;
}

/** 去除只有新增主题契约才会生成的声明，比较其余全部默认样式。 */
function restoreBaseline(source) {
  return restoreFallbacks(
    source
      .replace(/\[data-semi-theme\]\s*\{[^}]*\}/g, '')
      // 新增的零优先级普通文本规则不是固定 vendor 原声明，单独移除再比较其余默认值。
      .replace(
        /:where\(\.semi-typography\)\s*\{\s*font-weight:\s*var\(--semi-typography-font-weight,\s*inherit\);\s*\}/g,
        '',
      )
      .replace(/\s*font-weight: var\(--semi-typography-font-weight, inherit\);/g, '')
      .replace(/\s*--semi-(?:font-|line-height-)[\w-]+:[^;]+;/g, '')
      .replace(/body, :host\s*\{\s*\}/g, ''),
  )
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** 覆盖默认保持及公开入口两类契约。 */
describe('公开排版主题', () => {
  // 全量和模块化入口覆盖变量、共享 mixin、组件语义和代码字体等不同消费方式。
  it.each([
    'base',
    'index',
    'typography',
    'button',
    'input',
    'select',
    'table',
    'tooltip',
    'popover',
    'modal',
    'code-highlight',
    'json-viewer',
  ])('%s 的全部默认 CSS 声明保持固定 Semi 基线', (name) => {
    /** 原始入口同时用于原生编译和适配编译，避免用实现复制预期结果。 */
    const file = path.join(themeRoot, 'src', `${name}.scss`);
    /** 对照值来自完全未改写的固定 vendor SCSS。 */
    const baseline = sass
      .renderSync({ file, outputStyle: 'expanded', sourceMap: false })
      .css.toString()
      .trim();
    expect(restoreBaseline(compileTypographyTheme({ file }))).toBe(baseline);
  });

  it('全局常量只在根边界声明，组件变量在消费位置建立 fallback', () => {
    /** 全量 CSS 同时包含默认常量和组件的实际消费声明。 */
    const css = compileTypographyTheme({ file: path.join(themeRoot, 'src/index.scss') });
    expect(css).toContain('--semi-font-size-regular: 14px;');
    expect(css).toContain('--semi-line-height-header-1: 44px;');
    expect(css).toContain('--semi-font-weight-strong: 600;');
    expect(css).not.toMatch(/--semi-font-family-monospace\s*:/);
    expect(css).toContain('var(--semi-button-font-size, var(--semi-font-size-regular, 14px))');
    expect(css).toContain(
      'var(--semi-typography-title-font-weight, var(--semi-font-weight-strong, 600))',
    );
    expect(css).toContain('var(--semi-line-height-paragraph-extended, 24px)');
    expect(css).toContain('font-family: var(--semi-font-family-monospace, ui-monospace');
    expect(css).toMatch(/h1-weight-bold\s*\{\s*font-weight: 700;/);
  });

  it('保留控件对齐行高和普通 Text 的继承语义', () => {
    /** 源语义转换必须在编译前区分布局高度和排版行高。 */
    const inputFile = path.join(
      themeRoot,
      '../../vendor/semi-design/packages/semi-foundation/input/input.scss',
    );
    /** 读取的原文仍是只读基线，不通过编译结果猜测声明用途。 */
    const source = readFileSync(inputFile, 'utf8');
    expect(transformTypographySource(source, inputFile)).toContain(
      'line-height: $height-input_default;',
    );
    /** Typography 明确允许继承宿主字重，不能强制应用默认 400。 */
    const typography = compileTypographyTheme({
      file: path.join(themeRoot, 'src/typography.scss'),
    });
    expect(typography).toContain('font-weight: var(--semi-typography-font-weight, inherit);');
    expect(typography).toMatch(
      /:where\(\.semi-typography\)\s*\{\s*font-weight: var\(--semi-typography-font-weight, inherit\);/,
    );
  });
});
