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
          d: 'M12 1a11 11 0 1 1 0 22 11 11 0 0 1 0-22Zm3.2 6.3a1 1 0 0 0-1.4 0L12 9.08l-1.8-1.8a1 1 0 1 0-1.4 1.42L10.08 10H9a1 1 0 1 0 0 2h2v1H9a1 1 0 1 0 0 2h2v1a1 1 0 0 0 2 0v-1h2a1 1 0 0 0 0-2h-2v-1h2a1 1 0 0 0 0-2h-1.09l1.3-1.3a1 1 0 0 0 0-1.4Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'coin_money');
