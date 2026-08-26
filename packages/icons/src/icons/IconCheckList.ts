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
      h('g', { opacity: 0.99 }, [
        h(
          'path',
          {
            'fill-rule': 'evenodd',
            'clip-rule': 'evenodd',
            d: 'M7.7 2.3a1 1 0 0 0-1.4 0L4 4.58l-1.3-1.3a1 1 0 0 0-1.4 1.42l2 2a1 1 0 0 0 1.4 0l3-3a1 1 0 0 0 0-1.42Zm2.8.7a1.5 1.5 0 1 0 0 3h10a1.5 1.5 0 0 0 0-3h-10ZM9 11.5c0-.83.67-1.5 1.5-1.5h10a1.5 1.5 0 0 1 0 3h-10A1.5 1.5 0 0 1 9 11.5Zm0 7c0-.83.67-1.5 1.5-1.5h10a1.5 1.5 0 0 1 0 3h-10A1.5 1.5 0 0 1 9 18.5ZM6.3 9.3a1 1 0 0 1 1.4 1.4l-3 3a1 1 0 0 1-1.4 0l-2-2a1 1 0 1 1 1.4-1.4L4 11.58l2.3-2.3Zm1.4 7a1 1 0 0 0-1.4 0L4 18.58l-1.3-1.3a1 1 0 0 0-1.4 1.42l2 2a1 1 0 0 0 1.4 0l3-3a1 1 0 0 0 0-1.42Z',
            fill: 'currentColor',
          },
          undefined,
        ),
      ]),
    ],
  );
}

export default convertIcon(renderSvg, 'check_list');
