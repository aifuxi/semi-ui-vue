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
          d: 'M4 1a1 1 0 0 0-1 1v5a1 1 0 0 0 .4.8L7 10.5v.6a7 7 0 1 0 10 0v-.6l3.6-2.7A1 1 0 0 0 21 7V2a1 1 0 0 0-1-1H4Zm3 15a4.99 4.99 0 0 1 8.33-3.73A4.99 4.99 0 0 1 12 21a5 5 0 0 1-5-5Zm2-6.33a6.97 6.97 0 0 1 6 0V3H9v6.67ZM15 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'prize');
