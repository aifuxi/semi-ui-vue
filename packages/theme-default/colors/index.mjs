import baseline from './baseline.mjs';
import { buildColorTheme } from './theme.mjs';

export { generateColorScale, generateColorPalette } from './palette.mjs';
export { colorThemeToCss } from './theme.mjs';

/** 创建深浅模式颜色主题；默认组件 CSS 不会调用此函数或重新生成默认色盘。 */
export function createColorTheme(options) {
  return buildColorTheme(options, baseline);
}
