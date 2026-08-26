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
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          d: 'M21.5 19a1.5 1.5 0 0 0 0-3H19V8c0-1.5-1.5-3-3-3H8V2.5a1.5 1.5 0 1 0-3 0V5H2.5a1.5 1.5 0 1 0 0 3H5v8c0 1.5 1.5 3 3 3h8v2.5a1.5 1.5 0 0 0 3 0V19h2.5ZM16 16V9a1 1 0 0 0-1-1H8v7a1 1 0 0 0 1 1h7Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'crop');
