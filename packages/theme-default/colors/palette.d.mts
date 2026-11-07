/** 与 Semi 色阶一致的公开模式，不读取系统或 DOM 状态。 */
export type ColorMode = 'light' | 'dark';
/** 十级色阶按 0…9 排列，每一级都是小写六位不透明 HEX。 */
export type ColorScale = readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];
/** 色盘包含十六组基础色以及独立品牌色阶。 */
export type ColorPaletteName =
  | 'red'
  | 'pink'
  | 'purple'
  | 'violet'
  | 'indigo'
  | 'blue'
  | 'light-blue'
  | 'cyan'
  | 'teal'
  | 'green'
  | 'light-green'
  | 'lime'
  | 'yellow'
  | 'amber'
  | 'orange'
  | 'grey'
  | 'brand';
/** 每组命名色均包含完整的十级梯度。 */
export type ColorPalette = Readonly<Record<ColorPaletteName, ColorScale>>;
/** 省略 mode 时生成浅色，非法运行时取值抛出 TypeError。 */
export interface ColorGenerationOptions {
  mode?: ColorMode;
}
/** 生成单色阶；仅接受 #RGB/#RRGGBB，非法颜色抛 TypeError。 */
export function generateColorScale(color: string, options?: ColorGenerationOptions): ColorScale;
/** 生成完整色盘；无色相品牌色抛 RangeError，其他输入规则与单色阶一致。 */
export function generateColorPalette(brand: string, options?: ColorGenerationOptions): ColorPalette;
