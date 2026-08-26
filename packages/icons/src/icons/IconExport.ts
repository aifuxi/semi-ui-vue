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
          d: 'M11.08.82a1.5 1.5 0 0 1 1.84 0l4.5 3.5a1.5 1.5 0 0 1-1.84 2.36L13.5 5.07V7.5a1.5 1.5 0 0 1-3 0V5.07L8.42 6.68a1.5 1.5 0 0 1-1.84-2.36l4.5-3.5Z',
          fill: 'currentColor',
        },
        undefined,
      ),
      h(
        'path',
        {
          d: 'M2 11a3 3 0 0 1 3-3h5.5v6.5a1.5 1.5 0 0 0 3 0V8H19a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'export');
