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
          d: 'M4 1a1 1 0 0 0 0 2h1v5c0 .27.1.52.3.7L8.58 12l-3.3 3.3A1 1 0 0 0 5 16v5H4a1 1 0 1 0 0 2h16a1 1 0 1 0 0-2h-1v-5a1 1 0 0 0-.3-.7L15.42 12l3.3-3.3A1 1 0 0 0 19 8V3h1a1 1 0 1 0 0-2H4Zm9.3 10.3L17 7.58V3H7v4.59l3.7 3.7a1 1 0 0 1 0 1.42L7 16.4V21h10v-4.59l-3.7-3.7a1 1 0 0 1 0-1.42ZM9 7a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1Zm0 11a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'hourglass_stroked');
