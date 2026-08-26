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
          d: 'm1.85 11.15 9.8-9.8c.2-.2.5-.2.7 0l9.8 9.8a.5.5 0 0 1-.36.85H16v9a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-9H2.2a.5.5 0 0 1-.35-.85Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'filled_arrow_up');
