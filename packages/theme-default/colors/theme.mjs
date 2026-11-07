import { generateColorPalette } from './palette.mjs';

/** 识别可随颜色主题覆盖的变量，不将排版、圆角或尺寸混入主题。 */
export function isColorToken(name) {
  return (
    /^--semi-(?:(?:red|pink|purple|violet|indigo|blue|light-blue|cyan|teal|green|light-green|lime|yellow|amber|orange|grey|brand)-[0-9]|black|white)$/.test(
      name,
    ) ||
    name.startsWith('--semi-color-') ||
    name.startsWith('--semi-ai-') ||
    name === '--semi-shadow-elevated'
  );
}

/** 绑定固定基线的语义引用；此内部函数只由公开入口和构建验收调用。 */
export function buildColorTheme({ brand }, baseline) {
  /** 两种模式各自生成，深色不是将浅色数组直接倒序。 */
  const palette = {
    light: generateColorPalette(brand),
    dark: generateColorPalette(brand, { mode: 'dark' }),
  };
  /** 每次调用独立复制基线变量，避免业务修改返回对象污染其他主题。 */
  const variables = { light: { ...baseline.light }, dark: { ...baseline.dark } };
  for (const mode of ['light', 'dark']) {
    for (const [name, scale] of Object.entries(palette[mode])) {
      for (const [level, hex] of scale.entries()) {
        /** Semi 的基础色变量为逗号分隔的 RGB 通道，而非完整 CSS 颜色。 */
        const channels = [1, 3, 5].map(
          /** 每两个 HEX 字符对应一个 8 位颜色通道。 */
          (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16),
        );
        variables[mode][`--semi-${name}-${level}`] = channels.join(', ');
      }
    }
    for (const [name, value] of Object.entries(variables[mode])) {
      if (/^--semi-color-(?:primary(?:-|$)|link(?:-|$)|focus-border$)/.test(name)) {
        // 主操作、链接、焦点绑定品牌色；info 仍消费独立 blue 色相。
        variables[mode][name] = value.replace(/var\(--semi-blue-(\d)\)/g, 'var(--semi-brand-$1)');
      }
    }
  }
  return { version: 1, brand: palette.light.brand[5], palette, variables };
}

/** 为模式变量生成私有载体名称，使强制模式能消费最近主题的另一套颜色。 */
function modeToken(name, mode) {
  return `--semi-theme-${mode}-${name.slice('--semi-'.length)}`;
}

/** 序列化声明列表，保持变量顺序稳定，便于保存、审阅和缓存 CSS。 */
function declarations(variables) {
  return Object.entries(variables)
    .map(
      /** 变量值来自生成器和固定基线，不依赖 DOM 或 Sass 解析。 */
      ([name, value]) => `  ${name}: ${value};`,
    )
    .join('\n');
}

/** 输出普通 CSS；调用方明确提供模式选择器，函数不推断 DOM 层级或修改页面。 */
export function colorThemeToCss(theme, { selectors }) {
  for (const mode of ['light', 'dark']) {
    if (
      typeof selectors[mode] !== 'string' ||
      !selectors[mode].trim() ||
      /[{};]/.test(selectors[mode])
    ) {
      throw new TypeError('颜色主题需要有效且非空的 light/dark CSS 选择器');
    }
  }
  /** 两种模式共用载体，以便在任一当前模式中嵌套 always-light/dark。 */
  const carriers = {};
  for (const mode of ['light', 'dark']) {
    for (const [name, value] of Object.entries(theme.variables[mode])) {
      // 将引用也改为同模式载体，防止深色载体在浅色根上提前解析成浅色。
      carriers[modeToken(name, mode)] = value.replace(
        /var\((--semi-[\w-]+)/g,
        /** 只重定向颜色引用，不扩展到布局或其他业务变量。 */
        (match, referenced) =>
          isColorToken(referenced) ? `var(${modeToken(referenced, mode)}` : match,
      );
    }
  }
  /** :is() 正确容纳逗号选择器；强制模式规则只声明当前匹配元素的变量。 */
  const scope = `:is(${selectors.light}, ${selectors.dark})`;
  /** 私有载体先定义，随后定义当前模式和显式强制模式。 */
  const rules = [`${scope} {\n${declarations(carriers)}\n}`];
  for (const mode of ['light', 'dark']) {
    rules.push(`${selectors[mode]} {\n${declarations(theme.variables[mode])}\n}`);
  }
  for (const mode of ['light', 'dark']) {
    /** 规则在嵌套主题间引用相同载体名，因此不会跨主题抢用外层颜色。 */
    const forced = {};
    for (const name of Object.keys(theme.variables[mode])) {
      forced[name] = `var(${modeToken(name, mode)})`;
    }
    rules.push(
      `${scope}.semi-always-${mode}, ${scope} .semi-always-${mode} {\n${declarations(forced)}\n}`,
    );
  }
  return `${rules.join('\n\n')}\n`;
}
