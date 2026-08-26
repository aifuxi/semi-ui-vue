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
          d: 'M11.94 22.94a1.5 1.5 0 0 1-1.5-1.5V10.06l-4.38 4.38a1.5 1.5 0 1 1-2.12-2.12l6.94-6.94a1.5 1.5 0 0 1 2.12 0l7.06 7.06a1.5 1.5 0 0 1-2.12 2.12l-4.5-4.5v11.38c0 .83-.67 1.5-1.5 1.5Z',
          fill: 'currentColor',
        },
        undefined,
      ),
      h(
        'path',
        {
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          d: 'M18.44.94a1.5 1.5 0 1 1 0 3h-13a1.5 1.5 0 1 1 0-3h13Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'back_top');
