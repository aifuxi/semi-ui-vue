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
          d: 'M5 2a3 3 0 0 0-3 3v3h20c0-2-1-4-3-4h-6.45a3 3 0 0 1-1.87-.66l-1.13-.9A2 2 0 0 0 8.3 2H5Z',
          fill: 'currentColor',
        },
        undefined,
      ),
      h(
        'path',
        { d: 'M22 10H2v9a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-9Z', fill: 'currentColor' },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'folder');
