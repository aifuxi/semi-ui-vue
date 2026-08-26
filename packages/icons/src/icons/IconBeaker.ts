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
          d: 'M7 9.63V4a1.5 1.5 0 0 1 0-3h10a1.5 1.5 0 0 1 0 3v5.63l5.07 9.71A2.5 2.5 0 0 1 19.85 23H4.15a2.5 2.5 0 0 1-2.22-3.66L7 9.64ZM14 4h-4v6c0 .24-.06.48-.17.7L8.63 13h6.74l-1.2-2.3A1.5 1.5 0 0 1 14 10V4Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'beaker');
