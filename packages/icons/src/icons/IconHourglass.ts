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
          d: 'M20 1a1 1 0 1 1 0 2h-1v5a1 1 0 0 1-.3.7L15.42 12l3.3 3.3a1 1 0 0 1 .29.7v5h1a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2h1v-5a1 1 0 0 1 .3-.7L8.58 12l-3.3-3.3A1 1 0 0 1 5 8V3H4a1 1 0 0 1 0-2h16ZM9 18a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Zm1-12a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2h-4Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'hourglass');
