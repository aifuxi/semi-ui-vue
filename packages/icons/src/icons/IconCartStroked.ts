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
      h('path', { d: 'M9.65 18a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z', fill: 'currentColor' }, undefined),
      h('path', { d: 'M18.65 18a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z', fill: 'currentColor' }, undefined),
      h(
        'path',
        {
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          d: 'M5.5 2c.68 0 1.27.46 1.44 1.11l.03.13.14.79h14.71a1 1 0 0 1 .98 1.21l-1.56 7a1 1 0 0 1-.8.77l-.17.02H8.67L9.02 15h11.14a1 1 0 0 1 0 2H8.6a1.5 1.5 0 0 1-1.48-1.24L5.28 5.2l-.01-.07L5.07 4h-2.9a1 1 0 0 1 0-2H5.5ZM7.8 8.07l.52 2.96h11.14l1.1-5H7.46l.36 2.04Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'cart_stroked');
