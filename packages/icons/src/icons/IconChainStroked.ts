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
          d: 'M18.36 5.64a3 3 0 0 0-4.24 0L12 7.76a1 1 0 1 1-1.41-1.42l2.12-2.12a5 5 0 0 1 7.07 7.07l-2.12 2.12A1 1 0 0 1 16.24 12l2.12-2.12a3 3 0 0 0 0-4.24ZM5.64 18.36a3 3 0 0 0 4.24 0L12 16.24a1 1 0 0 1 1.41 1.42l-2.12 2.12a5 5 0 0 1-7.07-7.07l2.12-2.12A1 1 0 0 1 7.76 12l-2.12 2.12a3 3 0 0 0 0 4.24Zm9.9-8.48a1 1 0 0 0-1.42-1.42l-5.66 5.66a1 1 0 1 0 1.42 1.42l5.66-5.66Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'chain_stroked');
