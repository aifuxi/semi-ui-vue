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
          d: 'M17.72 3.73a3 3 0 0 0-2.72-1.73H9a3 3 0 0 0 0 6h1l-2.46 5.91ZM21.68 2.61a1 1 0 0 0-1.42-1.42L1.19 20.26a1 1 0 0 0 1.42 1.42ZM15 4H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2ZM11.7 9h.6l.04.11-1.14 1.14ZM15.26 11.03l1.24 2.97a1.5 1.5 0 0 1 0 3H9.3ZM13.73 12.57l.57 1.43h-2ZM11 17h2v4a1 1 0 0 1-2 0v-4Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'pin_off_stroked');
