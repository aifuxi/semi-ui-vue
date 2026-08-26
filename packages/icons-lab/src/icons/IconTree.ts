// Generated from the pinned Semi Design v2.102.0 source. Do not edit directly.
import { h, type VNode } from 'vue';
import { convertIcon, type IconSvgProps } from '../components/Icon';

function renderSvg(props: IconSvgProps): VNode {
  return h(
    'svg',
    {
      viewBox: '0 0 24 24',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      width: '1em',
      height: '1em',
      focusable: false,
      'aria-hidden': true,
      ...props,
    },
    [
      h('rect', { x: 9, y: 16, width: 13, height: 5, rx: 0.5, fill: '#6A6F7F' }, undefined),
      h('rect', { x: 9, y: 9, width: 13, height: 5, rx: 0.5, fill: '#6A6F7F' }, undefined),
      h(
        'path',
        {
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          d: 'M5 6a1 1 0 0 1 1 1v11h1a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z',
          fill: '#AAB2BF',
        },
        undefined,
      ),
      h(
        'path',
        {
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          d: 'M5 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z',
          fill: '#AAB2BF',
        },
        undefined,
      ),
      h('rect', { x: 2, y: 2, width: 15, height: 5, rx: 0.5, fill: '#4CC3FA' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'tree');
