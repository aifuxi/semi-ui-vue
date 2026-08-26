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
      h(
        'path',
        {
          d: 'M3.13 8.1A3 3 0 0 0 2 10.44V19a3 3 0 0 0 3 3h4v-6a3 3 0 1 1 6 0v6h4a3 3 0 0 0 3-3v-8.56a3 3 0 0 0-1.13-2.34L13.25 2a2 2 0 0 0-2.5 0L3.13 8.1Z',
          fill: '#DDE3E8',
        },
        undefined,
      ),
      h('path', { d: 'M9 15v7h6v-7a3 3 0 1 0-6 0Z', fill: '#6A6F7F' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'intro');
