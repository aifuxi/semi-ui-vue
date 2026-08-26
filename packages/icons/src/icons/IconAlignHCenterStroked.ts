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
          d: 'M11 3a1 1 0 1 1 2 0v2h7a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-7v2h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4v2a1 1 0 1 1-2 0v-2H7a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h4v-2H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h7V3Zm1 14h4v-2H8v2h4Zm7-8H5V7h14v2Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'align_h_center_stroked');
