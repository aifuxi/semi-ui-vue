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
          d: 'M20.95 13A9 9 0 1 1 11 3.05V7.1a5 5 0 1 0 5.9 5.9h4.05Zm0-2H16.9A5 5 0 0 0 13 7.1V3.05A9 9 0 0 1 20.95 11ZM23 12a11 11 0 1 1-22 0 11 11 0 0 1 22 0Zm-8 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'ring_chart_stroked');
