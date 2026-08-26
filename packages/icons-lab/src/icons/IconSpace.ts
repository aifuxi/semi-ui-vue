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
      h('rect', { x: 1, y: 2, width: 2, height: 20, rx: 1, fill: '#DDE3E8' }, undefined),
      h('rect', { x: 21, y: 2, width: 2, height: 20, rx: 1, fill: '#DDE3E8' }, undefined),
      h(
        'path',
        { d: 'M6 12h12', stroke: '#4CC3FA', 'stroke-width': 2, 'stroke-linecap': 'round' },
        undefined,
      ),
      h(
        'path',
        {
          d: 'm15 9 3 3-3 3',
          stroke: '#4CC3FA',
          'stroke-width': 2,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
        undefined,
      ),
      h(
        'path',
        {
          d: 'm9 9-3 3 3 3',
          stroke: '#4CC3FA',
          'stroke-width': 2,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'space');
