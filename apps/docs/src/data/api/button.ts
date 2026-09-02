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
        '显示加载并阻止点击。',
        'Shows loading and prevents clicks.',
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
];
