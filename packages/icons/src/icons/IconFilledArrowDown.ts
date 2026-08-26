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
          d: 'm22.15 12.06-9.8 9.8a.5.5 0 0 1-.7 0l-9.8-9.8a.5.5 0 0 1 .36-.85H8v-9a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v9h5.8a.5.5 0 0 1 .35.85Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'filled_arrow_down');
