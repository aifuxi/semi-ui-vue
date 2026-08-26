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
          d: 'M16 2a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-4Zm0 2h4v16h-4V4Zm-5.59 11.3A1 1 0 0 1 9 13.87l.59-.59H4.4l.59.59a1 1 0 1 1-1.41 1.41L1.29 13a1 1 0 0 1 0-1.41l2.3-2.3A1 1 0 0 1 5 10.71l-.59.58H9.6L9 10.71a1 1 0 1 1 1.41-1.42l2.3 2.3a1 1 0 0 1 0 1.41l-2.3 2.3Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'margin_left_stroked');
