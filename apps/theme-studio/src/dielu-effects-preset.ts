import type { ColorMode } from '@aifuxi/semi-theme-default/colors';
import type { TokenBinding, TokenDefinition } from './token-catalog';

/** 来源的 Input/Select/TextArea 交互边界：排除禁用、无边框与组合选择器内部搜索，保留只读反馈。 */
const controls = [
  {
    selector:
      '.semi-input-wrapper:not(.semi-input-borderless):not(.semi-input-wrapper-disabled):not(.semi-select *):not(.semi-tree-select *):not(.semi-cascader *)',
    state: 'semi-input-wrapper',
  },
  {
    selector: '.semi-select:not(.semi-select-borderless):not(.semi-select-disabled)',
    state: 'semi-select',
  },
  {
    selector:
      '.semi-input-textarea-wrapper:not(.semi-input-textarea-borderless):not(.semi-input-textarea-wrapper-disabled)',
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

/** common.css 与 interactions.css 的原实现：hover、focus/open 共用 4px、零模糊的单层外扩。 */
function glow(role: 'normal' | 'danger' | 'warning', focused: boolean): TokenDefinition {
  /** 正常状态跟随当前焦点色，校验反馈保持原有语义。 */
  const color = role === 'normal' ? '--semi-color-focus-border' : `--semi-color-${role}`;
  /** light.css/dark.css 的原始显色比例；颜色仍读取当前主题的对应语义。 */
  const lightAlpha = 10;
  /** 深色同样不区分 hover 和 focus 的透明度。 */
  const darkAlpha = 18;
  /** 固定原始外扩，不自行增加不同状态的宽度或模糊层。 */
  const width = 4;
  /** 仅匹配当前校验角色；focus/open 的规则排在 hover 后。 */
  const selectors = controls.flatMap(
    /** 按公开组件根类区分正常、错误与警告，不覆盖禁用或嵌套输入。 */
    ({ selector, state }) => {
      // TextArea 校验由专用浅色规则消费，避免通用选择器优先级覆盖其 hover 状态。
      if (state === 'semi-input-textarea-wrapper' && role !== 'normal') return [];
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
    /** 与光晕相同的交互边界，防止内部搜索产生额外动画。 */
    ({ selector }) => selector,
  ),
  '.semi-button:not(.semi-button-disabled):not(.semi-button-colorful)',
];

/** 原主题共用的浮层几何；深色的 1px 是外侧描边阴影，不是 inset。 */
const elevatedLight = '0 0 1px rgb(0 0 0 / 30%), 0 4px 14px rgb(0 0 0 / 10%)';
/** 保留源主题 8/28 的位移和模糊，边缘颜色适配当前文字色，背景完全独立。 */
const elevatedDark =
  '0 8px 28px rgb(0 0 0 / 40%), 0 0 0 1px color-mix(in srgb, var(--semi-color-text-0) 12%, transparent)';

/** 原主题 TextArea 校验光晕直接消费语义浅色，而非单行输入使用的 10%/18% 混色。 */
function textareaGlow(role: 'danger' | 'warning', focused: boolean): TokenDefinition {
  /** 只读保留反馈；禁用和无边框不绘制光晕。 */
  const selector = `.semi-input-textarea-wrapper:not(.semi-input-textarea-borderless):not(.semi-input-textarea-wrapper-disabled).semi-input-textarea-wrapper-${role === 'danger' ? 'error' : 'warning'}`;
  /** 浅色 token 只用于 box-shadow，不覆盖其原有背景值。 */
  const value = `0 0 0 4px var(--semi-color-${role}-${role === 'danger' ? 'light-default' : 'light-hover'})`;
  return effect(
    `textarea-${role}-${focused ? 'focus' : 'hover'}-glow`,
    `多行${role === 'danger' ? '错误' : '警告'}${focused ? '聚焦' : '悬浮'}光晕`,
    value,
    value,
    [focused ? `${selector}:focus-within` : `${selector}:hover:not(:focus-within)`],
  );
}

/** 卡片、Popover、Modal 复用源主题同一套阴影，不额外给 Tooltip 增加投影。 */
export const dieluEffectsTokens: TokenDefinition[] = [
  effect('card-shadow', '卡片阴影', elevatedLight, elevatedDark, [
    '.semi-card-shadows-always',
    '.semi-card-shadows-hover:hover',
  ]),
  effect('popup-shadow', '下拉浮层阴影', elevatedLight, elevatedDark, ['.semi-popover-wrapper']),
  effect('modal-shadow', '弹窗阴影', elevatedLight, elevatedDark, ['.semi-modal-content']),
  glow('normal', false),
  glow('danger', false),
  glow('warning', false),
  glow('normal', true),
  glow('danger', true),
  glow('warning', true),
  textareaGlow('danger', false),
  textareaGlow('warning', false),
  textareaGlow('danger', true),
  textareaGlow('warning', true),
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
