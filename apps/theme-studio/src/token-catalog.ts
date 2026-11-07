import baselineCss from '@aifuxi/semi-theme-default/base.css?raw';
import { dieluBrandTokens } from './dielu-preset';
import { dieluForegroundTokens } from './dielu-foreground-preset';

/** 工作台按固定基线的样式职责组织变量。 */
export type TokenCategory =
  'palette' | 'color' | 'typography' | 'radius' | 'spacing' | 'shadow' | 'motion';
/** 尚无公开运行时变量的属性，由工作台私有 token 映射到明确的组件选择器。 */
export interface TokenBinding {
  selector: string;
  property: string;
}
/** defaultValue / darkValue 均是可直接输出的 CSS 值；RGB 通道保持 Semi 原始格式。 */
export interface TokenDefinition {
  name: string;
  label: string;
  category: TokenCategory;
  defaultValue: string;
  darkValue?: string;
  kind: 'color' | 'number' | 'text';
  unit?: string;
  min?: number;
  max?: number;
  channels?: boolean;
  alphaChannel?: boolean;
  component?: string;
  bindings?: TokenBinding[];
  source?: 'public' | 'studio';
}
/** 每个组件编辑器只展示已有映射能实际消费的变量。 */
export interface ComponentDefinition {
  value: string;
  label: string;
  group: string;
}
/** 分类值供导航、搜索和编辑面板共用。 */
export const categories: { value: TokenCategory; label: string }[] = [
  { value: 'palette', label: '基础色阶' },
  { value: 'color', label: '色盘' },
  { value: 'typography', label: '字体排版' },
  { value: 'radius', label: '圆角' },
  { value: 'spacing', label: '间距' },
  { value: 'shadow', label: '阴影' },
  { value: 'motion', label: '动效属性' },
];
/** 组件分组沿用 DSM 工作方式；仅提供已实现的八类组件。 */
export const components: ComponentDefinition[] = [
  { value: 'button', label: 'Button 按钮', group: '输入' },
  { value: 'input', label: 'Input 输入框', group: '输入' },
  { value: 'select', label: 'Select 选择器', group: '输入' },
  { value: 'tag', label: 'Tag 标签', group: '展示' },
  { value: 'card', label: 'Card 卡片', group: '展示' },
  { value: 'table', label: 'Table 表格', group: '展示' },
  { value: 'modal', label: 'Modal 模态框', group: '反馈' },
  { value: 'tooltip', label: 'Tooltip 提示', group: '反馈' },
];

/** 从已编译公开 CSS 读取默认值，不复制 vendor 色盘或通过算法重建固定基线。 */
function readBaseline(): { light: Record<string, string>; dark: Record<string, string> } {
  /** 顺序遵循 CSS 层叠，同模式后面的声明覆盖前面的声明。 */
  const values = { light: {} as Record<string, string>, dark: {} as Record<string, string> };
  for (const rule of baselineCss.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    /** dark 块包含显式 theme-mode 或强制深色类，其余 body 根声明共用。 */
    const dark = /^body\[theme-mode=["']?dark|^body \.semi-always-dark/.test(
      rule[1]!.split(',')[0]!.trim(),
    );
    /** global light 规则自身含 dark ancestor；以首个选择器判断，避免误分类。 */
    const modes: ('light' | 'dark')[] = dark
      ? ['dark']
      : /^\s*body\s*,\s*:host\s*$/.test(rule[1]!)
        ? ['light', 'dark']
        : ['light'];
    for (const declaration of rule[2]!.matchAll(/(--semi-[\w-]+)\s*:\s*([^;]+);/g)) {
      for (const mode of modes) values[mode][declaration[1]!] = declaration[2]!.trim();
    }
  }
  return values;
}
/** 两种模式原始声明用于读取引用关系和固定默认值。 */
export const baselineVariables = readBaseline();

/** 将公开变量归到可编辑样式类别，非主题声明不进入目录。 */
function categoryOf(name: string): TokenCategory | undefined {
  if (
    /^--semi-(?:(?:amber|blue|cyan|green|grey|indigo|light-blue|light-green|lime|orange|pink|purple|red|teal|violet|yellow)-\d$|black$|white$|ai-)/.test(
      name,
    ) &&
    !name.startsWith('--semi-color-')
  )
    return 'palette';
  if (name.startsWith('--semi-color-')) return 'color';
  if (/^--semi-(?:font-|line-height-)/.test(name)) return 'typography';
  if (name.startsWith('--semi-border-radius-')) return 'radius';
  if (name.startsWith('--semi-shadow-')) return 'shadow';
  if (/^--semi-(?:transition_|transform[_-])/.test(name)) return 'motion';
  return undefined;
}
/** 语义色名称保持原有 token；高频角色额外提供中文说明。 */
function tokenLabel(name: string): string {
  /** 角色词表只描述含义，所有状态后缀仍保留在 token 名中。 */
  const roles: Record<string, string> = {
    primary: '主要颜色',
    secondary: '次要颜色',
    tertiary: '第三颜色',
    success: '成功色',
    info: '信息色',
    warning: '警示色',
    danger: '危险色',
    text: '文字颜色',
    fill: '填充颜色',
    bg: '背景颜色',
    link: '链接颜色',
    border: '描边颜色',
    disabled: '禁用颜色',
  };
  /** 去掉公共前缀后仍保留完整角色，避免不同状态显示成相同标题。 */
  const short = name.replace(/^--semi-(?:color-)?/, '');
  /** 按首段匹配角色，状态由完整 short 补充。 */
  const role = roles[short.split('-')[0]!];
  return role ? `${role} · ${short}` : short;
}
/** 将 CSS 默认值转换为编辑元数据，数值仍保留原单位。 */
function publicToken(name: string, category: TokenCategory, defaultValue: string): TokenDefinition {
  /** 通道值不是 CSS color，保存时必须保持逗号 RGB 形式。 */
  const channels =
    /^(?:(?:\d+(?:\.\d+)?|\.\d+)\s*,\s*){2}(?:\d+(?:\.\d+)?|\.\d+)(?:\s*,\s*(?:0?(?:\.\d+)|0|1(?:\.0+)?))?$/.test(
      defaultValue,
    );
  /** 显式 alpha 通道需要 rgba 包装，不能追加不透明值或按普通 CSS 颜色保存。 */
  const alphaChannel = channels && defaultValue.split(',').length === 4;
  /** 仅单个数值可以用数值输入，复合表达式保留文本编辑。 */
  const numeric = defaultValue.match(/^(-?\d+(?:\.\d+)?)(px|ms|%)?$/);
  return {
    name,
    label: tokenLabel(name),
    source: 'public',
    category,
    defaultValue,
    darkValue: baselineVariables.dark[name] ?? defaultValue,
    kind:
      /gradient\(/.test(defaultValue) || /^var\(--semi-ai-general-/.test(defaultValue)
        ? 'text'
        : category === 'palette' || category === 'color'
          ? 'color'
          : numeric
            ? 'number'
            : 'text',
    ...(channels ? { channels: true, ...(alphaChannel ? { alphaChannel: true } : {}) } : {}),
    ...(numeric
      ? {
          unit: numeric[2] ?? '',
          min: 0,
          max:
            numeric[2] === 'ms'
              ? 5000
              : numeric[2] === '%'
                ? 100
                : name.endsWith('-full')
                  ? 9999
                  : name.includes('weight')
                    ? 900
                    : 200,
        }
      : {}),
  };
}
/** 已编译 CSS 的全部公开主题变量；AI 渐变仍以原始 CSS 字符串编辑。 */
const publicTokens: TokenDefinition[] = [];
for (const [name, value] of Object.entries(baselineVariables.light)) {
  /** 只收录分类契约中的公开变量。 */
  const category = categoryOf(name);
  if (category) publicTokens.push(publicToken(name, category, value));
}

/** 固定 SCSS 间距来自 vendor 的 variables.scss；bindings 只覆盖已确认的消费位置。
 * 没有绑定的间距用于自定义布局导出，不声称会改写所有预编译组件。
 */
const spacingValues: [string, number, TokenBinding[]][] = [
  ['none', 0, []],
  ['super-tight', 2, []],
  ['extra-tight', 4, []],
  [
    'tight',
    8,
    [
      { selector: '.semi-tag', property: 'padding-inline' },
      { selector: '.semi-tooltip-wrapper', property: 'padding-block' },
    ],
  ],
  [
    'base-tight',
    12,
    [
      { selector: '.semi-button', property: 'padding-inline' },
      { selector: '.semi-tooltip-wrapper', property: 'padding-inline' },
    ],
  ],
  [
    'base',
    16,
    [
      {
        selector: '.semi-table-thead > .semi-table-row > .semi-table-row-head',
        property: 'padding-inline',
      },
      {
        selector: '.semi-table-tbody > .semi-table-row > .semi-table-row-cell',
        property: 'padding-inline',
      },
    ],
  ],
  ['base-loose', 20, [{ selector: '.semi-card-body', property: 'padding' }]],
  ['loose', 24, [{ selector: '.semi-modal-content', property: 'padding-inline' }]],
  ['extra-loose', 32, []],
  ['super-loose', 40, []],
];
/** 私有间距 token 通过 bindings 输出普通 CSS 规则，不扩展公开包 API。 */
const spacingTokens: TokenDefinition[] = spacingValues.map(
  /** 目录保留所有尺度，绑定范围在说明中可见。 */
  ([scale, value, bindings]) => ({
    name: `--studio-spacing-${scale}`,
    label: `间距 · ${scale}`,
    category: 'spacing',
    defaultValue: `${value}px`,
    kind: 'number',
    unit: 'px',
    min: 0,
    max: 200,
    source: 'studio',
    bindings,
  }),
);

/** 固定样式映射为工作台私有 token，不将其伪装成组件已公开的 CSS 变量。 */
function bound(
  component: string,
  name: string,
  label: string,
  category: TokenCategory,
  defaultValue: string,
  selector: string,
  property: string,
): TokenDefinition {
  /** 单数值与通用公开变量使用同一编辑单位约定。 */
  const numeric = defaultValue.match(/^(-?\d+(?:\.\d+)?)(px|ms|%)?$/);
  return {
    name: name.startsWith('$')
      ? `--studio-${name
          .slice(1)
          .replaceAll('_', '-')
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .toLowerCase()}`
      : name,
    label,
    source: 'studio',
    category,
    defaultValue,
    kind: category === 'color' ? 'color' : numeric ? 'number' : 'text',
    ...(numeric
      ? {
          unit: numeric[2] ?? '',
          min: /weight/i.test(name) ? 100 : 0,
          max: numeric[2] === 'ms' ? 5000 : /weight/i.test(name) ? 900 : 200,
        }
      : {}),
    component,
    bindings: [{ selector, property }],
  };
}
/** 排版变量已由主题包公开，不需要额外选择器覆盖。 */
function font(
  component: string,
  name: string,
  label: string,
  defaultValue: string,
): TokenDefinition {
  return {
    name,
    label,
    source: 'public',
    category: 'typography',
    defaultValue,
    kind: 'number',
    unit: name.includes('weight') ? '' : 'px',
    min: name.includes('weight') ? 100 : 8,
    max: name.includes('weight') ? 900 : 100,
    component,
  };
}

/** 八类组件的实际可编辑属性；数值及引用来自固定 vendor 变量与编译 CSS。 */
export const componentTokens: TokenDefinition[] = [
  font('button', '--semi-button-font-size', '按钮字号', '14px'),
  font('button', '--semi-button-font-weight', '按钮字重', '600'),
  font('button', '--semi-button-line-height', '按钮行高', '20px'),
  bound(
    'button',
    '$color-button_primary-bg-default',
    '主要按钮背景',
    'color',
    'var(--semi-color-primary)',
    '.semi-button-primary:not(.semi-button-light):not(.semi-button-borderless):not(.semi-button-outline):not(:disabled)',
    'background-color',
  ),
  bound(
    'button',
    '$color-button_primary-bg-hover',
    '主要按钮背景 · 悬浮',
    'color',
    'var(--semi-color-primary-hover)',
    '.semi-button-primary:not(.semi-button-light):not(.semi-button-borderless):not(.semi-button-outline):not(:disabled):hover',
    'background-color',
  ),
  bound(
    'button',
    '$color-button_primary-bg-active',
    '主要按钮背景 · 按下',
    'color',
    'var(--semi-color-primary-active)',
    '.semi-button-primary:not(.semi-button-light):not(.semi-button-borderless):not(.semi-button-outline):not(:disabled):active',
    'background-color',
  ),
  bound(
    'button',
    '$color-button_primary-text-default',
    '主要按钮文字',
    'color',
    'rgba(var(--semi-white), 1)',
    '.semi-button-primary:not(.semi-button-light):not(.semi-button-borderless):not(.semi-button-outline):not(:disabled)',
    'color',
  ),
  bound(
    'button',
    '$height-button_default',
    '默认按钮高度',
    'spacing',
    '32px',
    '.semi-button:not(.semi-button-size-small):not(.semi-button-size-large)',
    'height',
  ),
  bound(
    'button',
    '$radius-button',
    '按钮圆角',
    'radius',
    'var(--semi-border-radius-small)',
    '.semi-button',
    'border-radius',
  ),
  bound(
    'button',
    '$spacing-button_default-paddingX',
    '按钮水平内边距',
    'spacing',
    '12px',
    '.semi-button:not(.semi-button-size-small):not(.semi-button-size-large)',
    'padding-inline',
  ),
  bound(
    'input',
    '$color-input_default-bg-default',
    '输入框背景',
    'color',
    'var(--semi-color-fill-0)',
    '.semi-input-wrapper:not(.semi-input-wrapper-disabled)',
    'background-color',
  ),
  bound(
    'input',
    '$color-input_default-text-default',
    '输入文字',
    'color',
    'var(--semi-color-text-0)',
    '.semi-input',
    'color',
  ),
  bound(
    'input',
    '$height-input_default',
    '默认输入框高度',
    'spacing',
    '32px',
    '.semi-input-wrapper-default',
    'height',
  ),
  bound(
    'input',
    '$radius-input',
    '输入框圆角',
    'radius',
    'var(--semi-border-radius-small)',
    '.semi-input-wrapper',
    'border-radius',
  ),
  bound(
    'input',
    '$spacing-input_default-paddingLeft',
    '输入框左内边距',
    'spacing',
    '12px',
    '.semi-input',
    'padding-left',
  ),
  bound(
    'select',
    '$color-select-bg-default',
    '选择器背景',
    'color',
    'var(--semi-color-fill-0)',
    '.semi-select:not(.semi-select-disabled)',
    'background-color',
  ),
  bound(
    'select',
    '$color-select-text-default',
    '选择器文字',
    'color',
    'var(--semi-color-text-0)',
    '.semi-select-selection-text',
    'color',
  ),
  font('select', '--semi-select-font-weight', '选择器字重', '400'),
  bound(
    'select',
    '$height-select_default',
    '默认选择器高度',
    'spacing',
    '32px',
    '.semi-select:not(.semi-select-small):not(.semi-select-large)',
    'height',
  ),
  bound(
    'select',
    '$radius-select',
    '选择器圆角',
    'radius',
    'var(--semi-border-radius-small)',
    '.semi-select',
    'border-radius',
  ),
  bound(
    'tag',
    '$color-tag_white-bg-default',
    '白色标签背景',
    'color',
    'var(--semi-color-bg-4)',
    '.semi-tag-white-light, .semi-tag-white-solid, .semi-tag-white-ghost',
    'background-color',
  ),
  bound(
    'tag',
    '$color-tag_white-text-default',
    '白色标签文字',
    'color',
    'var(--semi-color-text-0)',
    '.semi-tag-white-light, .semi-tag-white-solid, .semi-tag-white-ghost',
    'color',
  ),
  bound('tag', '$height-tag_small', '小标签高度', 'spacing', '20px', '.semi-tag-small', 'height'),
  bound(
    'tag',
    '$radius-tag',
    '标签圆角',
    'radius',
    'var(--semi-border-radius-small)',
    '.semi-tag',
    'border-radius',
  ),
  bound(
    'tag',
    '$spacing-tag_small-paddingX',
    '标签水平内边距',
    'spacing',
    '8px',
    '.semi-tag-default, .semi-tag-small',
    'padding-inline',
  ),
  font('card', '--semi-card-default-font-size', '卡片正文字号', '14px'),
  // Card 的 title 字符串渲染为 Typography.Title，不能用只供 Card.Meta 消费的变量。
  bound(
    'card',
    '--studio-card-title-font-size',
    '卡片标题字号',
    'typography',
    '16px',
    '.semi-card-header-wrapper-title > .semi-typography',
    'font-size',
  ),
  bound(
    'card',
    '--studio-card-title-font-weight',
    '卡片标题字重',
    'typography',
    '600',
    '.semi-card-header-wrapper-title > .semi-typography',
    'font-weight',
  ),
  bound(
    'card',
    '$color-card-bg-default',
    '卡片背景',
    'color',
    'var(--semi-color-bg-0)',
    '.semi-card',
    'background-color',
  ),
  bound(
    'card',
    '$radius-card',
    '卡片圆角',
    'radius',
    'var(--semi-border-radius-medium)',
    '.semi-card',
    'border-radius',
  ),
  bound(
    'card',
    '$spacing-card-padding',
    '卡片内边距',
    'spacing',
    '20px',
    '.semi-card-body',
    'padding',
  ),
  bound(
    'card',
    '$shadow-card',
    '卡片阴影',
    'shadow',
    'var(--semi-shadow-elevated)',
    '.semi-card-shadows-always, .semi-card-shadows-hover:hover',
    'box-shadow',
  ),
  bound(
    'card',
    '$motion-card-transition_duration',
    '卡片过渡时长',
    'motion',
    '300ms',
    '.semi-card',
    'transition-duration',
  ),
  // 公开 base 字号仅由空占位消费；表格整体字号用私有适配作用于实际 wrapper。
  bound(
    'table',
    '--studio-table-font-size',
    '表格字号',
    'typography',
    '14px',
    '.semi-table-wrapper',
    'font-size',
  ),
  bound(
    'table',
    '$color-table_header-bg-default',
    '表头背景',
    'color',
    'var(--semi-color-bg-1)',
    '.semi-table-thead > .semi-table-row > .semi-table-row-head',
    'background-color',
  ),
  bound(
    'table',
    '$color-table_body-bg-default',
    '表格背景',
    'color',
    'var(--semi-color-bg-1)',
    '.semi-table-tbody > .semi-table-row > .semi-table-row-cell',
    'background-color',
  ),
  bound(
    'table',
    '$spacing-table_cell-paddingLeft',
    '单元格左内边距',
    'spacing',
    '16px',
    '.semi-table-thead > .semi-table-row > .semi-table-row-head, .semi-table-tbody > .semi-table-row > .semi-table-row-cell',
    'padding-left',
  ),
  bound(
    'table',
    '$spacing-table_cell-paddingTop',
    '单元格上内边距',
    'spacing',
    '8px',
    '.semi-table-thead > .semi-table-row > .semi-table-row-head',
    'padding-top',
  ),
  font('modal', '--semi-modal-header-font-size', '弹窗标题字号', '14px'),
  font('modal', '--semi-modal-header-font-weight', '弹窗标题字重', '600'),
  bound(
    'modal',
    '$color-modal-bg',
    '弹窗背景',
    'color',
    'var(--semi-color-bg-2)',
    '.semi-modal-content',
    'background-color',
  ),
  bound(
    'modal',
    '$radius-modal_content',
    '弹窗圆角',
    'radius',
    'var(--semi-border-radius-large)',
    '.semi-modal-content',
    'border-radius',
  ),
  bound(
    'modal',
    '$spacing-modal_content-paddingX',
    '弹窗水平内边距',
    'spacing',
    '24px',
    '.semi-modal-content',
    'padding-inline',
  ),
  bound(
    'modal',
    '$shadow-modal_content',
    '弹窗阴影',
    'shadow',
    'var(--semi-shadow-elevated)',
    '.semi-modal-content',
    'box-shadow',
  ),
  bound(
    'tooltip',
    '--studio-tooltip-font-size',
    '提示文字字号',
    'typography',
    '14px',
    '.semi-tooltip-wrapper',
    'font-size',
  ),
  bound(
    'tooltip',
    '$color-tooltip-bg-default',
    '提示背景',
    'color',
    'rgba(var(--semi-grey-7), 1)',
    '.semi-tooltip-wrapper',
    'background-color',
  ),
  bound(
    'tooltip',
    '$color-tooltip-text-default',
    '提示文字',
    'color',
    'var(--semi-color-bg-0)',
    '.semi-tooltip-wrapper',
    'color',
  ),
  bound(
    'tooltip',
    '$radius-tooltip',
    '提示圆角',
    'radius',
    'var(--semi-border-radius-medium)',
    '.semi-tooltip-wrapper',
    'border-radius',
  ),
  bound(
    'tooltip',
    '$spacing-tooltip_content-paddingLeft',
    '提示左内边距',
    'spacing',
    '12px',
    '.semi-tooltip-wrapper',
    'padding-left',
  ),
  bound(
    'tooltip',
    '$spacing-tooltip_content-paddingTop',
    '提示上内边距',
    'spacing',
    '8px',
    '.semi-tooltip-wrapper',
    'padding-top',
  ),
  ...(['default', 'hover', 'active'] as const).map(
    /** 辅助品牌实心按钮保留独立三态，不能拿语义前景代替深色按钮填充。 */
    (state) =>
      bound(
        'button',
        `$color-button_secondary-bg-${state}`,
        `次要按钮背景${state === 'default' ? '' : state === 'hover' ? ' · 悬浮' : ' · 按下'}`,
        'color',
        `var(--semi-color-secondary${state === 'default' ? '' : `-${state}`})`,
        `.semi-button-secondary:not(.semi-button-light):not(.semi-button-borderless):not(.semi-button-outline):not(:disabled)${state === 'default' ? '' : `:${state}`}`,
        'background-color',
      ),
  ),
];
/** 品牌生成器公开输出十级 RGB 载体；固定模式尚未启用品牌时以默认蓝作编辑起点。 */
const brandTokens: TokenDefinition[] = Array.from(
  { length: 10 },
  /** 第 0–9 级与颜色 API 的输出名称一致，不重算固定默认蓝。 */
  (_, level) => ({
    name: `--semi-brand-${level}`,
    label: `brand-${level}`,
    category: 'palette',
    defaultValue: baselineVariables.light[`--semi-blue-${level}`]!,
    darkValue: baselineVariables.dark[`--semi-blue-${level}`]!,
    kind: 'color',
    channels: true,
    source: 'public',
  }),
);
/** 全局目录不会混入组件属性，便于独立展示和导出。 */
export const globalTokens: TokenDefinition[] = [
  ...brandTokens,
  ...publicTokens,
  ...spacingTokens,
  ...dieluBrandTokens,
  ...dieluForegroundTokens,
];
/** 全目录用于导入校验、按名称定位和变更计数。 */
export const tokens: TokenDefinition[] = [...globalTokens, ...componentTokens];
