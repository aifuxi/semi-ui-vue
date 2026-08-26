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
          d: 'M8.5 1a1 1 0 0 0 0 2h7a1 1 0 1 0 0-2h-7ZM12 4a9.5 9.5 0 1 0 6.67 2.74l1.04-1.03a1 1 0 0 0-1.42-1.42L17.1 5.5A9.46 9.46 0 0 0 12 4Zm-7.5 9.5a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0ZM13 9a1 1 0 1 0-2 0v4.5a1 1 0 1 0 2 0V9Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'stopwatch_stroked');
