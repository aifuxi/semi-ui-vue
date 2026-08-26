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
          d: 'M6.61 14.04a1 1 0 0 1 .89-.54h9a1 1 0 0 1 .82 1.57l-4.5 6.5a1 1 0 0 1-1.64 0l-4.5-6.5a1 1 0 0 1-.07-1.03Zm2.8 1.46L12 19.24l2.6-3.74H9.4Z',
          fill: 'currentColor',
        },
        undefined,
      ),
      h(
        'path',
        {
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          d: 'M12 2a1 1 0 0 1 .82.43l4.5 6.5a1 1 0 0 1-.82 1.57h-9a1 1 0 0 1-.82-1.57l4.5-6.5A1 1 0 0 1 12 2ZM9.4 8.5h5.2L12 4.76 9.4 8.5Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'sort_stroked');
