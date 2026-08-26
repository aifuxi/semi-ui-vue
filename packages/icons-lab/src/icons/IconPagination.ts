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
      h('path', { d: 'M1 8a3 3 0 0 1 3-3h8v14H4a3 3 0 0 1-3-3V8Z', fill: '#6A6F7F' }, undefined),
      h(
        'path',
        {
          d: 'm8 9-3 3 3 3',
          stroke: 'white',
          'stroke-width': 2,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
        undefined,
      ),
      h('path', { d: 'M12 5h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-8V5Z', fill: '#DDE3E8' }, undefined),
      h(
        'path',
        {
          d: 'm16 9 3 3-3 3',
          stroke: '#AAB2BF',
          'stroke-width': 2,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'pagination');
