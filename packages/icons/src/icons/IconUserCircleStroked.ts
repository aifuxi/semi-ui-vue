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
          d: 'M23.03 12.03a11 11 0 1 1-22 0 11 11 0 0 1 22 0Zm-4.3 6.01A9 9 0 1 0 5.3 18a7.02 7.02 0 0 1 3.57-4.25A4.49 4.49 0 0 1 12 6a4.5 4.5 0 0 1 3.13 7.74 7.02 7.02 0 0 1 3.6 4.3Zm-1.75 1.5a5 5 0 0 0-9.96-.03 8.96 8.96 0 0 0 9.96.04ZM12 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'user_circle_stroked');
