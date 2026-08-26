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
        'rect',
        {
          x: 2.75,
          y: 2.75,
          width: 18.5,
          height: 18.5,
          rx: 3,
          fill: 'white',
          stroke: '#AAB2BF',
          'stroke-width': 1.5,
        },
        undefined,
      ),
      h('rect', { x: 5, y: 11, width: 4, height: 2, fill: '#4CC3FA' }, undefined),
      h('rect', { x: 15, y: 11, width: 4, height: 2, fill: '#4CC3FA' }, undefined),
      h('rect', { x: 10, y: 11, width: 4, height: 2, fill: '#324350' }, undefined),
      h('rect', { x: 10, y: 11, width: 4, height: 2, fill: '#4CC3FA' }, undefined),
      h('rect', { x: 5, y: 16, width: 14, height: 2, fill: '#324350' }, undefined),
      h('rect', { x: 5, y: 6, width: 14, height: 2, fill: '#324350' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'divider');
