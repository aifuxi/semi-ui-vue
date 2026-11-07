import { tokens, type TokenDefinition } from './token-catalog';
import type { Studio } from './studio';

/** 在当前主题文档中解析 CSS 引用，仅用于变量色样和引用检查。 */
export function resolveToken(
  studio: Studio,
  token: TokenDefinition,
  seen = new Set<string>(),
): string {
  if (seen.has(token.name)) return '';
  seen.add(token.name);
  /** 变量可引用 RGB 通道、语义色或排版尺度；递归路径分别复制以支持重复引用。 */
  const resolved = studio.tokenValue(token).replace(
    /var\(\s*(--[\w-]+)\s*\)/g,
    /** 引用关系只用于展示，不改写用户保存的原始表达式。 */
    (_match, name: string) => {
      /** 全名查找，无法解析的变量保留空值而不伪造默认色。 */
      const target = tokens.find(
        /** 目录是唯一受支持的变量来源。 */
        (item) => item.name === name,
      );
      return target ? resolveToken(studio, target, new Set(seen)) : '';
    },
  );
  return resolved;
}

/** 基础通道需包成 rgb 才能渲染；其他颜色保留用户的 CSS 表达式。 */
export function swatchColor(studio: Studio, token: TokenDefinition): string {
  /** 预览解析不参与主题输出。 */
  const value = resolveToken(studio, token);
  return token.channels ? `${token.alphaChannel ? 'rgba' : 'rgb'}(${value})` : value;
}

/** 计算不透明颜色与白/黑背景的 WCAG 2 对比度；透明色先与背景合成。 */
export function contrastRatio(value: string, dark: boolean): number | null {
  /** 工作台仅为可解析的 HEX/RGB 给出数值，不将未知 CSS 色值报为通过。 */
  const hex = value.match(/^#([\da-f]{6})$/i);
  /** RGB 与 alpha 同时读取，允许基础色盘或语义色解析后的 rgba。 */
  const rgb = value.match(
    /^rgba?\(\s*([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/i,
  );
  /** 黑白对照背景使当前检查与用户选择完全一致。 */
  const background = dark ? 0 : 255;
  /** 三个通道都按 WCAG 的 sRGB 转线性阈值计算。 */
  const channels = hex
    ? [1, 3, 5].map(
        /** 每两位 HEX 表示一个通道。 */
        (offset) => Number.parseInt(value.slice(offset, offset + 2), 16),
      )
    : rgb
      ? [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])]
      : null;
  if (!channels) return null;
  /** 缺少 alpha 表示完全不透明。 */
  const alpha = rgb?.[4] === undefined ? 1 : Number(rgb[4]);
  /** 通道合成后换算到 0–1 范围。 */
  const linear = channels.map(
    /** WCAG 2.2 使用 0.04045 作为 sRGB 分段点。 */
    (channel) => {
      /** 合成后的通道用于实际可见颜色的亮度。 */
      const normalized = (channel * alpha + background * (1 - alpha)) / 255;
      return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    },
  );
  /** WCAG 相对亮度的 RGB 权重。 */
  const luminance = linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722;
  return dark ? (luminance + 0.05) / 0.05 : 1.05 / (luminance + 0.05);
}
