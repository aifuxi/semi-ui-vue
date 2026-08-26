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
          d: 'M20 3a3 3 0 0 1 3 3v11a3 3 0 0 1-2.85 3H3.85A3 3 0 0 1 1 17.15V6a3 3 0 0 1 3-3h16ZM3 17a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-7H3v7ZM4 5a1 1 0 0 0-1 1v2h18V6a1 1 0 0 0-1-1H4Z',
          fill: 'currentColor',
        },
        undefined,
      ),
      h(
        'path',
        {
          d: 'M5 14a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-1Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'credit_card_stroked');
