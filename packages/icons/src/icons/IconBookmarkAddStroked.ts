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
          d: 'M6 3v16.72l4.63-2.39a3 3 0 0 1 2.74 0L18 19.72V3H6ZM5 1a1 1 0 0 0-1 1v19.36a1 1 0 0 0 1.46.89l6.08-3.14a1 1 0 0 1 .92 0l6.08 3.14a1 1 0 0 0 1.46-.9V2a1 1 0 0 0-1-1H5Zm3 9a1 1 0 0 1 1-1h2V7a1 1 0 1 1 2 0v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2H9a1 1 0 0 1-1-1Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'bookmark_add_stroked');
