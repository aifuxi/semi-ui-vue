import type { ColorPalette } from './palette.mjs';
export { generateColorScale, generateColorPalette } from './palette.mjs';
export type {
  ColorMode,
  ColorScale,
  ColorPalette,
  ColorPaletteName,
  ColorGenerationOptions,
} from './palette.mjs';

/** 可以直接序列化为 JSON 的双模式主题；RGB 色盘与语义变量保持 Semi 格式。 */
export interface ColorTheme {
  readonly version: 1;
  readonly brand: string;
  readonly palette: Readonly<{ light: ColorPalette; dark: ColorPalette }>;
  readonly variables: Readonly<{
    light: Readonly<Record<string, string>>;
    dark: Readonly<Record<string, string>>;
  }>;
}

/** 颜色只支持不透明 #RGB/#RRGGBB；整盘品牌色必须具有非零饱和度。 */
export function createColorTheme(options: { brand: string }): ColorTheme;

/** 调用方明确选择全局或局部模式边界；返回普通 CSS，不访问 DOM 或注入样式。 */
export function colorThemeToCss(
  theme: ColorTheme,
  options: { selectors: { light: string; dark: string } },
): string;
