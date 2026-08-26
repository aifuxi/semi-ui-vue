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
          d: 'M16 21a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h8Zm3-10.5a1 1 0 0 1 1 1 8 8 0 1 1-16 0 1 1 0 1 1 2 0 6 6 0 0 0 12 0 1 1 0 0 1 1-1ZM12 1a4.5 4.5 0 0 1 4.5 4.5v6a4.5 4.5 0 1 1-9 0v-6A4.5 4.5 0 0 1 12 1Zm0 2a2.5 2.5 0 0 0-2.5 2.5v6a2.5 2.5 0 0 0 5 0v-6A2.5 2.5 0 0 0 12 3Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'microphone_stroked');
