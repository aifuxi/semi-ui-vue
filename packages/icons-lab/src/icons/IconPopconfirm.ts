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
      h('rect', { x: 5, y: 8, width: 17, height: 14, rx: 2, fill: '#AAB2BF' }, undefined),
      h(
        'path',
        {
          d: 'M8.47 2.3a.6.6 0 0 0-1.04 0L5.83 5H4a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h13a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-6.92L8.47 2.3Z',
          fill: '#DDE3E8',
        },
        undefined,
      ),
      h('rect', { x: 7, y: 13, width: 4, height: 3, rx: 1, fill: '#4CC3FA' }, undefined),
      h('rect', { x: 13, y: 13, width: 4, height: 3, rx: 1, fill: '#324350' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'popconfirm');
