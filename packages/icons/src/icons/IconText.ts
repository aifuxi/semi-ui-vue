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
          d: 'M3 4.5C3 3.67 3.67 3 4.5 3h15c.83 0 1.5.67 1.5 1.5v3a1.5 1.5 0 0 1-3 0V6h-4.5v13h2a1.5 1.5 0 0 1 0 3h-7a1.5 1.5 0 0 1 0-3h2V6H6v1.5a1.5 1.5 0 1 1-3 0v-3Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'text');
