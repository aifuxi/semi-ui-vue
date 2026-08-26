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
      h('path', { d: 'M6 4h8l4 6.41a3 3 0 0 1 0 3.18L14 20H6V4Z', fill: '#AAB2BF' }, undefined),
      h(
        'path',
        {
          d: 'M2 7a3 3 0 0 1 3-3h2l4 6.41a3 3 0 0 1 0 3.18L7 20H5a3 3 0 0 1-3-3V7Z',
          fill: '#6A6F7F',
        },
        undefined,
      ),
      h(
        'path',
        {
          d: 'M13 20h3.34a3 3 0 0 0 2.54-1.41l3.13-5a3 3 0 0 0 0-3.18l-3.13-5A3 3 0 0 0 16.34 4H13l4 6.41a3 3 0 0 1 0 3.18L13 20Z',
          fill: '#DDE3E8',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'breadcrumb');
