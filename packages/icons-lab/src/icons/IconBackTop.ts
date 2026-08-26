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
          d: 'M2.97 14.13 12 6l9.03 8.13a.5.5 0 0 1-.33.87H16v7H8v-7H3.3a.5.5 0 0 1-.33-.87Z',
          fill: '#4CC3FA',
        },
        undefined,
      ),
      h('rect', { x: 3, y: 2, width: 18, height: 4, rx: 1, fill: '#AAB2BF' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'back-top');
