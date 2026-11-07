/** 构建期输入，允许调用方传入虚拟样式源码并保持原始文件解析位置。 */
export interface TypographyThemeOptions {
  file: string;
  data?: string;
  includePaths?: string[];
}

/** 固定 Semi 基线的字号、行高尺度；单位为 px。 */
export const typographyScales: Record<string, [number, number]>;

/** 按只读源声明语义添加公开 CSS 变量及递归 import 适配。 */
export function transformTypographySource(source: string, file: string): string;

/** 共用 npm 产物与开发虚拟样式的编译入口，输出已编译 CSS。 */
export function compileTypographyTheme(options: TypographyThemeOptions): string;
