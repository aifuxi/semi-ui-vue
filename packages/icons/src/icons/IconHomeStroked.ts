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
          d: 'M11.39 2.21a1 1 0 0 1 1.22 0l9 7A1 1 0 0 1 22 10v11a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-7h-4v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V10c0-.3.14-.6.39-.79l9-7ZM4 10.5V20h4v-7a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v7h4v-9.51l-8-6.22-8 6.22Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'home_stroked');
