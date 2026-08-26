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
          d: 'M19.5 5c.83 0 1.5.67 1.5 1.5v13c0 .83-.67 1.5-1.5 1.5h-13a1.5 1.5 0 0 1 0-3h9.38L2.44 4.56a1.5 1.5 0 1 1 2.12-2.12L18 15.88V6.5c0-.83.67-1.5 1.5-1.5Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'arrow_down_right');
