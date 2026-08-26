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
          d: 'M21 2a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V5.41l-9.3 9.3a1 1 0 0 1-1.4-1.42L18.58 4H15a1 1 0 1 1 0-2h6ZM2 5a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H4v14h14v-7a1 1 0 1 1 2 0v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'external_open_stroked');
