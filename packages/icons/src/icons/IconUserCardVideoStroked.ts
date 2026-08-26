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
      h('path', { d: 'M8 11H5V8h3v3Z', fill: 'currentColor' }, undefined),
      h(
        'path',
        {
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          d: 'M14 4a2 2 0 0 1 2 2v12a2 2 0 0 1-1.8 1.99L14 20H3l-.2-.01A2 2 0 0 1 1 18V6c0-1.1.9-2 2-2h11ZM3 18h11V6H3v12Z',
          fill: 'currentColor',
        },
        undefined,
      ),
      h(
        'path',
        {
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          d: 'M21.55 6.72a1 1 0 0 1 1.45.9v8.76a1 1 0 0 1-1.45.9l-4-2a1 1 0 0 1-.55-.9V9.62a1 1 0 0 1 .55-.9l4-2ZM19 10.24v3.52l2 1V9.24l-2 1Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'user_card_video_stroked');
