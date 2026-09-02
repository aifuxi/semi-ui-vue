import { apiItem as p } from './helpers';
import type { ApiSection } from './types';

export const iconApi: readonly ApiSection[] = [
  {
    id: 'icon-props',
    title: { 'zh-CN': 'Icon Props', 'en-US': 'Icon props' },
    kind: 'props',
    items: [
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
    id: 'icon-slots',
    title: { 'zh-CN': 'Slots', 'en-US': 'Slots' },
    kind: 'slots',
    items: [p('default', '() => VNodeChild', '—', '自定义 SVG。', 'Custom SVG content.')],
  },
];
