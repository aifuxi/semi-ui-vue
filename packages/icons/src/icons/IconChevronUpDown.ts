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
          d: 'M6.69 6.68A1.5 1.5 0 1 0 8.8 8.8L12 5.62l3.18 3.18a1.5 1.5 0 1 0 2.13-2.12l-4.25-4.24a1.5 1.5 0 0 0-2.12 0L6.7 6.68Z',
          fill: 'currentColor',
        },
        undefined,
      ),
      h(
        'path',
        {
          d: 'M17.3 17.32a1.5 1.5 0 0 0-2.13-2.12L12 18.38 8.81 15.2a1.5 1.5 0 1 0-2.12 2.12l4.24 4.24a1.5 1.5 0 0 0 2.12 0l4.25-4.24Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'chevron_up_down');
