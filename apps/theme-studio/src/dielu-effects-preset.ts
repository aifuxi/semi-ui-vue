import type { ColorMode } from '@aifuxi/semi-theme-default/colors';
import type { TokenBinding, TokenDefinition } from './token-catalog';

/** 来源的 Input/Select/TextArea 交互方式，排除禁用、无边框、只读与组合选择器内部搜索。 */
const controls = [
  {
    selector:
      '.semi-input-wrapper:not(.semi-input-borderless):not(.semi-input-wrapper-disabled):not(:has(input[readonly])):not(.semi-select *):not(.semi-tree-select *):not(.semi-cascader *)',
    state: 'semi-input-wrapper',
  },
  {
    selector: '.semi-select:not(.semi-select-borderless):not(.semi-select-disabled)',
    state: 'semi-select',
  },
  {
    selector:
      '.semi-input-textarea-wrapper:not(.semi-input-textarea-borderless):not(.semi-input-textarea-wrapper-disabled):not(:has(textarea[readonly]))',
    state: 'semi-input-textarea-wrapper',
  },
];

/** 阴影与过渡只选择预览/Portal 内的目标，独立局部主题继续自行管理外观。 */
function bind(selector: string, property: string, media?: string): TokenBinding {
  return {
    selector: `${selector}:where(:not([data-semi-theme="studio-local"] *))`,
    property,
    ...(media ? { media } : {}),
  };
}

/** CSS 值分别定义两种模式；实际配色引用当前主题，不复制来源背景或状态色盘。 */
function effect(
  name: string,
  label: string,
  light: string,
  dark: string,
  selectors: string[],
  property = 'box-shadow',
): TokenDefinition {
  return {
    name: `--studio-dielu-effect-${name}`,
    label: `交互 · ${label}`,
    category: property.startsWith('transition') ? 'motion' : 'shadow',
    kind: property === 'transition-duration' ? 'number' : 'text',
    ...(property === 'transition-duration' ? { unit: 'ms', min: 0, max: 5000 } : {}),
    source: 'studio',
    defaultValue: light,
    darkValue: dark,
    bindings: selectors.map(
      /** 拆分完整选择器，兼容当前作用域生成器。 */
      (selector) => bind(selector, property),
    ),
  };
}

/** 保留 hover 2px、focus/open 4px 的窄范围，仅通过显色比例加强反馈。 */
function glow(role: 'normal' | 'danger' | 'warning', focused: boolean): TokenDefinition {
  /** 正常状态跟随当前焦点色，校验反馈保持原有语义。 */
  const color = role === 'normal' ? '--semi-color-focus-border' : `--semi-color-${role}`;
  /** 浅色表面提高品牌/校验色占比，使光晕明显区别于控件原有细描边。 */
  const lightAlpha = focused ? (role === 'normal' ? 28 : 32) : role === 'normal' ? 18 : 22;
  /** 深色表面使用更高显色比例，避免透明叠加后只剩微弱边缘。 */
  const darkAlpha = focused ? (role === 'normal' ? 40 : 44) : role === 'normal' ? 28 : 32;
  /** box-shadow 不参与布局，不改变控件尺寸或背景。 */
  const width = focused ? 4 : 2;
  /** 仅匹配当前校验角色；focus/open 的规则排在 hover 后。 */
  const selectors = controls.flatMap(
    /** 按公开组件根类区分正常、错误与警告，不覆盖禁用或嵌套输入。 */
    ({ selector, state }) => {
      /** 同一输入只消费一种语义光晕。 */
      const target =
        role === 'normal'
          ? `${selector}:not(.${state}-error):not(.${state}-warning)`
          : `${selector}.${state}-${role === 'danger' ? 'error' : 'warning'}`;
      return focused
        ? [`${target}:focus-within`, `${target}.semi-select-open`]
        : [`${target}:hover:not(:focus-within):not(.semi-select-open)`];
    },
  );
  return effect(
    `${role}-${focused ? 'focus' : 'hover'}-glow`,
    `${{ normal: '正常', danger: '错误', warning: '警告' }[role]}${focused ? '聚焦' : '悬浮'}光晕`,
    `0 0 0 ${width}px color-mix(in srgb, var(${color}) ${lightAlpha}%, transparent)`,
    `0 0 0 ${width}px color-mix(in srgb, var(${color}) ${darkAlpha}%, transparent)`,
    selectors,
  );
}

/** 只柔化阴影、描边和文字；背景依旧按当前组件的原状态立即生效，不加入位移或缩放。 */
const animated = [
  ...controls.map(
    /** 与光晕相同的交互边界，防止只读和内部搜索产生额外动画。 */
    ({ selector }) => selector,
  ),
  '.semi-button:not(.semi-button-disabled):not(.semi-button-colorful)',
  '.semi-card-shadows',
];

/** 加深三档中性阴影的接触层和扩散层；深色边缘增强对比，不引入来源表面色。 */
export const dieluEffectsTokens: TokenDefinition[] = [
  effect(
    'card-shadow',
    '卡片阴影',
    '0 1px 3px rgb(0 0 0 / 16%), 0 6px 20px rgb(0 0 0 / 20%)',
    '0 8px 24px rgb(0 0 0 / 56%), inset 0 0 0 1px color-mix(in srgb, var(--semi-color-text-0) 16%, transparent)',
    ['.semi-card-shadows-always', '.semi-card-shadows-hover:hover'],
  ),
  effect(
    'popup-shadow',
    '下拉与提示阴影',
    '0 1px 3px rgb(0 0 0 / 20%), 0 8px 24px rgb(0 0 0 / 24%)',
    '0 12px 32px rgb(0 0 0 / 64%), inset 0 0 0 1px color-mix(in srgb, var(--semi-color-text-0) 20%, transparent)',
    ['.semi-popover-wrapper', '.semi-tooltip-wrapper'],
  ),
  effect(
    'modal-shadow',
    '弹窗阴影',
    '0 2px 6px rgb(0 0 0 / 24%), 0 16px 48px rgb(0 0 0 / 30%)',
    '0 20px 56px rgb(0 0 0 / 72%), inset 0 0 0 1px color-mix(in srgb, var(--semi-color-text-0) 22%, transparent)',
    ['.semi-modal-content'],
  ),
  glow('normal', false),
  glow('danger', false),
  glow('warning', false),
  glow('normal', true),
  glow('danger', true),
  glow('warning', true),
  effect(
    'transition',
    '阴影与描边过渡',
    'box-shadow 150ms ease, border-color 150ms ease, color 150ms ease',
    'box-shadow 150ms ease, border-color 150ms ease, color 150ms ease',
    animated,
    'transition',
  ),
  effect('duration', '交互过渡时长', '150ms', '150ms', animated, 'transition-duration'),
  {
    ...effect('reduced-duration', '减少动态效果时长', '0ms', '0ms', [], 'transition-duration'),
    bindings: animated.map(
      /** 系统偏好只移除本预设新增的过渡，不影响库的加载和弹层定位。 */
      (selector) => bind(selector, 'transition-duration', '(prefers-reduced-motion: reduce)'),
    ),
  },
];

/** 独立合并效果，保留已有排版、颜色及背景相关覆盖，支持撤销和 JSON/CSS 往返。 */
export function dieluEffectsVariables(mode: ColorMode): Record<string, string> {
  return Object.fromEntries(
    dieluEffectsTokens.map(
      /** 双模式仅切换阴影与光晕强度，颜色依旧在实际主题容器解析。 */
      (token) => [
        token.name,
        mode === 'dark' ? (token.darkValue ?? token.defaultValue) : token.defaultValue,
      ],
    ),
  );
}
