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
          d: 'M3 4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h11a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H3Zm4.98 4h-3v3h3V8Z',
          fill: 'currentColor',
        },
        undefined,
      ),
      h(
        'path',
        {
          d: 'M21.55 6.72a1 1 0 0 1 1.45.9v8.76a1 1 0 0 1-1.45.9l-4-2a1 1 0 0 1-.55-.9V9.62a1 1 0 0 1 .56-.9l4-2Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'user_card_video');
