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
          d: 'M13.5 2.5a1.5 1.5 0 0 0-3 0v9a1.5 1.5 0 0 0 3 0v-9ZM6.6 6.1a1.5 1.5 0 0 0-2.04-2.2 11 11 0 1 0 14.87 0 1.5 1.5 0 1 0-2.02 2.2 8 8 0 1 1-10.82 0Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'quit');
