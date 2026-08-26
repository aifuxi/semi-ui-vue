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
      h('path', { d: 'M4 4h7v7H4V4Z', fill: '#FBCD2C' }, undefined),
      h('path', { d: 'M3 11h17v9H3v-9Z', fill: '#3BCE4A' }, undefined),
      h(
        'path',
        {
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          d: 'M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3H5Zm5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm6.7 4.2a1 1 0 0 0-1.4 0L11 16l-1.3-1.3a1 1 0 0 0-1.4 0L5 18v1h14v-5l-2.3-2.3Z',
          fill: '#324350',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'image');
