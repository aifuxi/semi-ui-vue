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
            d: 'M8 4.5a1.5 1.5 0 1 0-3 0v11.38l-1.44-1.44a1.5 1.5 0 0 0-2.12 2.12l4 4a1.5 1.5 0 0 0 2.12 0l4-4a1.5 1.5 0 0 0-2.12-2.12L8 15.88V4.5ZM13.5 3a1.5 1.5 0 0 0 0 3h8a1.5 1.5 0 0 0 0-3h-8ZM12 12c0-.83.67-1.5 1.5-1.5h8a1.5 1.5 0 0 1 0 3h-8A1.5 1.5 0 0 1 12 12Zm0 7.5c0-.83.67-1.5 1.5-1.5h8a1.5 1.5 0 0 1 0 3h-8a1.5 1.5 0 0 1-1.5-1.5Z',
            fill: 'currentColor',
          },
          undefined,
        ),
      ]),
    ],
  );
}

export default convertIcon(renderSvg, 'descend2');
