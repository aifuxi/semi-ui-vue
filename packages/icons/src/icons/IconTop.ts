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
          d: 'M4 2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6.18l-7.42 8.16a.5.5 0 0 0 .37.84H8v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4.87a.5.5 0 0 0 .37-.84L13.82 6H20a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H4Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'top');
