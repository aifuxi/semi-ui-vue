// Generated from the pinned Semi Design v2.105.2 source. Do not edit directly.
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
          d: 'M9 2h6a3 3 0 0 1 0 6h-1l2.5 6a1.5 1.5 0 0 1 0 3H7.5a1.5 1.5 0 0 1 0-3l2.5-6H9a3 3 0 0 1 0-6ZM15 4H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2ZM11.7 9 9.7 14h4.6l-2-5h-.6ZM11 17h2v4a1 1 0 0 1-2 0v-4Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'pin_stroked');
