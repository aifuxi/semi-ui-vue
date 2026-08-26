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
          d: 'M16.56.44a1.5 1.5 0 0 0-2.12 2.12L15.88 4H12a10 10 0 1 0 10 10 1.5 1.5 0 0 0-3 0 7 7 0 1 1-7-7h3.88l-1.44 1.44a1.5 1.5 0 0 0 2.12 2.12l4-4a1.5 1.5 0 0 0 0-2.12l-4-4Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'refresh2');
