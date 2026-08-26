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
          d: 'M2.03 4.68a1.5 1.5 0 0 1 2.03.61c2.15 4 4.77 6.21 7.94 6.21 3.17 0 5.79-2.2 7.94-6.21a1.5 1.5 0 0 1 2.64 1.42 21.25 21.25 0 0 1-2.3 3.49l2.92 3.9a1.5 1.5 0 0 1-2.4 1.8l-2.68-3.58c-.67.53-1.39.98-2.15 1.32l1.43 3.83a1.5 1.5 0 1 1-2.8 1.06l-1.5-4a1.57 1.57 0 0 1-.03-.09 9.86 9.86 0 0 1-2.14 0l-.03.09-1.5 4a1.5 1.5 0 1 1-2.8-1.06l1.43-3.83c-.76-.34-1.48-.79-2.15-1.32L3.2 15.9a1.5 1.5 0 0 1-2.4-1.8l2.93-3.9A21.25 21.25 0 0 1 1.42 6.7a1.5 1.5 0 0 1 .6-2.03Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'eye_closed');
