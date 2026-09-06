import { apiItem as p } from './helpers';
import type { ApiSection } from './types';

export const buttonApi: readonly ApiSection[] = [
  {
    id: 'button-props',
    title: { 'zh-CN': 'Button Props', 'en-US': 'Button props' },
    kind: 'props',
    items: [
      p(
        'type',
        'primary | secondary | tertiary | warning | danger',
        'primary',
        '语义色。',
        'Semantic color.',
      ),
      p('theme', 'solid | borderless | light | outline', 'light', '视觉主题。', 'Visual theme.'),
      p('size', 'default | small | large', 'default', '按钮尺寸。', 'Button size.'),
      p('htmlType', 'button | reset | submit', 'button', '原生按钮类型。', 'Native button type.'),
      p('block', 'boolean', 'false', '占满父容器宽度。', 'Fills the parent width.'),
      p('circle', 'boolean', 'false', '启用圆形状态类。', 'Enables the circular state class.'),
      p('disabled', 'boolean', 'false', '禁用原生交互。', 'Disables native interaction.'),
      p(
        'loading',
        'boolean',
        'false',
        '显示加载图标并阻止指针点击；键盘仍可激活，disabled 优先。',
        'Shows loading and blocks pointer clicks; keyboard activation remains available unless disabled.',
      ),
      p('colorful', 'boolean', 'false', '启用 AI 多彩样式。', 'Enables the AI colorful style.'),
      p('iconPosition', 'left | right', 'left', '图标位置。', 'Icon position.'),
      p('iconSize', 'IconSize', '—', '传给图标插槽的尺寸。', 'Size passed to the icon slot.'),
      p('iconStyle', 'StyleValue', '—', '传给图标插槽的样式。', 'Style passed to the icon slot.'),
      p(
        'noHorizontalPadding',
        'boolean | left | right | (left | right)[]',
        'false',
        '移除指定方向内边距。',
        'Removes padding on selected sides.',
      ),
      p('contentClass', 'HTMLAttributes[class]', '—', '内容容器 class。', 'Content wrapper class.'),
      p('prefixCls', 'string', 'semi-button', 'DOM class 前缀。', 'DOM class prefix.'),
      p(
        'aria-label / id / class / style',
        'HTMLAttributes',
        '—',
        '原生根节点属性。',
        'Native root attributes.',
      ),
    ],
  },
  {
    id: 'button-slots',
    title: { 'zh-CN': 'Slots', 'en-US': 'Slots' },
    kind: 'slots',
    items: [
      p('default', '() => VNodeChild', '—', '按钮内容。', 'Button content.'),
      p(
        'icon',
        '(props) => VNodeChild',
        '—',
        '接收 fill、iconSize、iconStyle。',
        'Receives fill, iconSize, and iconStyle.',
      ),
    ],
  },
  {
    id: 'button-emits',
    title: { 'zh-CN': '事件', 'en-US': 'Events' },
    kind: 'emits',
    items: ['click', 'mousedown', 'mouseenter', 'mouseleave'].map((name) =>
      p(name, 'MouseEvent', '—', '原生鼠标事件。', 'Native mouse event.'),
    ),
  },
  {
    id: 'button-group-props',
    title: { 'zh-CN': 'ButtonGroup Props', 'en-US': 'ButtonGroup props' },
    kind: 'props',
    items: [
      p(
        'size',
        'large | default | small',
        'default',
        '组合尺寸，子按钮可显式覆盖。',
        'Group size; an explicit child prop overrides it.',
      ),
      p(
        'type',
        'primary | secondary | tertiary | warning | danger',
        '—',
        '组合语义色；未指定时保留子按钮配置，Button 默认为 primary。',
        'Group semantic color; omitted values preserve child configuration (Button defaults to primary).',
      ),
      p(
        'theme',
        'light | solid | borderless | outline',
        '—',
        '显式传入时覆盖子按钮主题；否则保留子按钮配置。',
        'An explicit theme overrides child themes; omission preserves child configuration.',
      ),
      p('disabled', 'boolean', 'false', '组合禁用状态。', 'Disables the group.'),
      p('colorful', 'boolean', 'false', '组合多彩样式。', 'Colorful group style.'),
      p('prefixCls', 'string', 'semi-button', 'DOM class 前缀。', 'DOM class prefix.'),
      p('aria-label', 'string', '—', '组合的可访问名称。', 'Accessible group name.'),
      p(
        'class / style',
        'HTMLAttributes[class] / StyleValue',
        '—',
        '根节点原生属性。',
        'Native root attributes.',
      ),
    ],
  },
  {
    id: 'split-button-group-props',
    title: { 'zh-CN': 'SplitButtonGroup Props', 'en-US': 'SplitButtonGroup props' },
    kind: 'props',
    items: [
      p('prefixCls', 'string', 'semi-button', 'DOM class 前缀。', 'DOM class prefix.'),
      p('aria-label', 'string', '—', '组合的可访问名称。', 'Accessible group name.'),
      p(
        'class / style',
        'HTMLAttributes[class] / StyleValue',
        '—',
        '根节点原生属性。',
        'Native root attributes.',
      ),
    ],
  },
  {
    id: 'button-group-slots',
    title: {
      'zh-CN': 'ButtonGroup / SplitButtonGroup Slots',
      'en-US': 'ButtonGroup / SplitButtonGroup slots',
    },
    kind: 'slots',
    items: [
      p(
        'default',
        '() => VNodeChild',
        '—',
        '组合内的按钮或 Dropdown。',
        'Buttons or Dropdown within the group.',
      ),
    ],
  },
];
