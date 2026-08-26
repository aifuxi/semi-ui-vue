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
          d: 'm6.45 8.34 4.8-6.48a1 1 0 0 1 1.5 0l4.8 6.48A1 1 0 0 1 16.8 10H7.2a1 1 0 0 1-.75-1.66Z',
          fill: 'currentColor',
        },
        undefined,
      ),
      h(
        'path',
        {
          d: 'm17.55 15.66-4.8 6.48a1 1 0 0 1-1.5 0l-4.8-6.48A1 1 0 0 1 7.2 14h9.6a1 1 0 0 1 .75 1.66Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'sort');
