import type { ColorMode } from '@aifuxi/semi-theme-default/colors';
import type { TokenDefinition } from './token-catalog';

/** 源自迭鹿 shared/styles/common.css，字体由 Fontsource 5.3.0 本地打包；中文使用系统回退。 */
export const dieluUiFont =
  "'Space Grotesk Variable', -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
/** 源自 typography.css 的代码字体栈，包含独立的等宽字体及真实斜体。 */
export const dieluCodeFont =
  "'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
/** 正文和四级标题对应源主题的 body / document-h3 尺度，不改控件尺寸与密度。 */
export const dieluTypography = {
  family: dieluUiFont,
  size: 14,
  lineHeight: 20,
  weight: 400,
  strong: 600,
  titleSize: 20,
  titleLineHeight: 28,
};

/** 将来源颜色限定到单个前景属性，防止共享 text/border 变量间接改变背景。 */
function foreground(
  name: string,
  label: string,
  light: string,
  dark: string,
  selectors: string[],
  property = 'color',
): TokenDefinition {
  return {
    name: `--studio-dielu-${name}`,
    label,
    category: property === 'font-family' ? 'typography' : 'color',
    kind: property === 'font-family' ? 'text' : 'color',
    source: 'studio',
    defaultValue: light,
    darkValue: dark,
    bindings: selectors.map(
      /** 排除嵌套的独立局部主题；伪元素前插入边界，保持 placeholder 选择器有效。 */
      (selector) => ({
        selector: selector.replace(/(::[\w-]+)?$/, ':not([data-semi-theme="studio-local"] *)$1'),
        property,
      }),
    ),
  };
}

/** 2026-11-08 的来源快照：light.css/dark.css 中 text-0/1/2/3 与边框角色。
 * 不复制灰色盘、不覆盖 --semi-color-text-* 或 --semi-color-border；它们也被若干组件用于背景。
 * 仅适配当前预览中的真实文字节点和描边；错误/警告保留自身反馈，禁用控件只改文字。
 */
export const dieluForegroundTokens: TokenDefinition[] = [
  foreground('text-primary', '迭鹿 · 正文前景', '#1d2129', '#eef0f4', [
    '.semi-typography:not(.semi-typography-secondary):not(.semi-typography-tertiary):not(.semi-typography-quaternary):not(.semi-typography-disabled):not(.semi-typography-link):not(.semi-typography-danger):not(.semi-typography-warning):not(.semi-typography-success)',
    '.semi-input:not(.semi-input-disabled)',
    '.semi-select:not(.semi-select-disabled) .semi-select-selection-text',
    '.semi-table-row-head',
    '.semi-table-row-cell',
    '.semi-select-option',
    '.semi-checkbox:not(.semi-checkbox-disabled)',
    '.semi-checkbox:not(.semi-checkbox-disabled) .semi-checkbox-addon',
    '.semi-radio:not(.semi-radio-disabled)',
    '.semi-radio:not(.semi-radio-disabled) .semi-radio-addon',
    '.semi-card-header',
  ]),
  foreground('text-secondary', '迭鹿 · 次级前景', '#4e5969', '#c4cbd5', [
    '.semi-typography-secondary:not(.semi-typography-disabled):not(.semi-typography-link)',
    '.semi-input-prefix',
    '.semi-input-suffix',
    '.semi-select-prefix',
    '.semi-select-suffix',
  ]),
  foreground('text-tertiary', '迭鹿 · 辅助说明', '#86909c', '#919eaf', [
    '.semi-typography-tertiary:not(.semi-typography-disabled):not(.semi-typography-link)',
    '.semi-input:not(.semi-input-disabled)::placeholder',
    '.semi-select:not(.semi-select-disabled) .semi-select-selection-placeholder',
  ]),
  foreground('text-quaternary', '迭鹿 · 弱提示', '#c9cdd4', '#5e6b7c', [
    '.semi-typography-quaternary:not(.semi-typography-disabled):not(.semi-typography-link)',
  ]),
  foreground('text-disabled', '迭鹿 · 禁用文字', '#c9cdd4', '#5e6b7c', [
    '.semi-typography-disabled',
    '.semi-input-disabled',
    '.semi-button-disabled',
    '.semi-select-disabled .semi-select-selection-text',
  ]),
  foreground(
    'border-color',
    '迭鹿 · 内容描边',
    '#e5e6eb',
    '#404753',
    [
      '.semi-card',
      '.semi-card-header',
      '.semi-card-footer',
      '.semi-table-row-head',
      '.semi-table-row-cell',
      '.semi-modal-header',
      '.semi-modal-footer',
    ],
    'border-color',
  ),
  foreground(
    'hover-border-color',
    '迭鹿 · 输入悬浮描边',
    '#c9cdd4',
    '#5e6b7c',
    [
      '.semi-input-wrapper:not(.semi-input-borderless):not(.semi-input-wrapper-disabled):not(.semi-input-wrapper-error):not(.semi-input-wrapper-warning):hover:not(:focus-within)',
      '.semi-select:not(.semi-select-borderless):not(.semi-select-disabled):not(.semi-select-error):not(.semi-select-warning):hover:not(:focus-within):not(.semi-select-open)',
    ],
    'border-color',
  ),
  foreground(
    'focus-border-color',
    '迭鹿 · 输入焦点描边',
    '#5b5af7',
    '#9b98ff',
    [
      '.semi-input-wrapper:not(.semi-input-borderless):not(.semi-input-wrapper-disabled):not(.semi-input-wrapper-error):not(.semi-input-wrapper-warning):focus-within',
      '.semi-select:not(.semi-select-borderless):not(.semi-select-disabled):not(.semi-select-error):not(.semi-select-warning):focus-within',
      '.semi-select-open:not(.semi-select-borderless):not(.semi-select-disabled):not(.semi-select-error):not(.semi-select-warning)',
    ],
    'border-color',
  ),
  foreground(
    'code-font-family',
    '迭鹿 · 代码字体',
    dieluCodeFont,
    dieluCodeFont,
    ['.semi-typography code', 'code.semi-typography', '.semi-typography pre'],
    'font-family',
  ),
];

/** 从同一目录生成覆盖，检查器默认值与导出内容共用一份来源快照。 */
export function dieluForegroundVariables(mode: ColorMode): Record<string, string> {
  return Object.fromEntries(
    dieluForegroundTokens.map(
      /** 前景在两种模式分别取值；排版两种模式共用同一字体栈。 */
      (token) => [
        token.name,
        mode === 'dark' ? (token.darkValue ?? token.defaultValue) : token.defaultValue,
      ],
    ),
  );
}
