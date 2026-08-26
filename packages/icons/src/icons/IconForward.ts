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
          d: 'm22.72 11.31-8.07-8.5a1 1 0 0 0-1.71.7v4C5.98 7.5 2 12 2 18c0 .5.24 2.18.56 2.31.13.06.28-.01.43-.32 2.23-4.46 4.48-4.5 9.95-4.5v5a1 1 0 0 0 1.71.7l8.07-8.5a1 1 0 0 0 0-1.38Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'forward');
