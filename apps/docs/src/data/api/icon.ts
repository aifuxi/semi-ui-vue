import { apiItem as p } from './helpers';
import type { ApiSection } from './types';

export const iconApi: readonly ApiSection[] = [
  {
    id: 'icon-props',
    title: { 'zh-CN': 'Icon Props', 'en-US': 'Icon props' },
    kind: 'props',
    items: [
      p('class', 'string | object | array', '—', '原生 class。', 'Native class.'),
      p(
        'style',
        'CSSProperties',
        '—',
        '原生 style，可覆盖 rotate。',
        'Native style; can override rotate.',
      ),
      p(
        'svg',
        'VNodeChild',
        '—',
        '程序化 SVG；优先使用默认 slot。',
        'Programmatic SVG; prefer the default slot.',
      ),
      p('aria-label', 'string', 'type', '可访问名称。', 'Accessible name.'),
      p('size', 'IconSize', 'default', '预设尺寸或 inherit。', 'Preset size or inherit.'),
      p('spin', 'boolean', 'false', '持续旋转。', 'Continuous rotation.'),
      p('rotate', 'number', '—', '安全整数角度。', 'Safe-integer rotation angle.'),
      p(
        'fill',
        'string | string[]',
        '—',
        'AI 双色/多色图标填充。',
        'AI bicolor or multicolor fills.',
      ),
      p('type', 'string', '—', '类型 class 与默认名称。', 'Type class and default label.'),
      p('prefixCls', 'string', 'semi', 'class 前缀。', 'Class prefix.'),
    ],
  },
  {
    id: 'icon-events',
    title: { 'zh-CN': '原生事件', 'en-US': 'Native events' },
    kind: 'emits',
    items: [
      p(
        'click / mousedown / mouseenter / mouseleave / mousemove / mouseup',
        '(event: MouseEvent) => void',
        '—',
        '监听器透传到根 span；不自动增加键盘激活。',
        'Listeners fall through to the root span; no automatic keyboard activation.',
      ),
    ],
  },
  {
    id: 'icon-slots',
    title: { 'zh-CN': 'Slots', 'en-US': 'Slots' },
    kind: 'slots',
    items: [p('default', '() => VNodeChild', '—', '自定义 SVG。', 'Custom SVG content.')],
  },
];
