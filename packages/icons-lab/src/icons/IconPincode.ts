// Generated from the pinned Semi Design v2.102.0 source. Do not edit directly.
import { h, type VNode } from 'vue';
import { convertIcon, type IconSvgProps } from '../components/Icon';

function renderSvg(props: IconSvgProps): VNode {
  return h(
    'svg',
    {
      viewBox: '0 0 22 16',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      width: '1em',
      height: '1em',
      focusable: false,
      'aria-hidden': true,
      ...props,
    },
    [
      h('rect', { width: 22, height: 16, rx: 2, fill: '#4CC3FA' }, undefined),
      h('rect', { x: 3, y: 4, width: 16, height: 8, rx: 1, fill: 'white' }, undefined),
      h('circle', { cx: 6.5, cy: 8, r: 1, fill: '#4CC3FA' }, undefined),
      h('circle', { cx: 9.5, cy: 8, r: 1, fill: '#4CC3FA' }, undefined),
      h('circle', { cx: 12.5, cy: 8, r: 1, fill: '#4CC3FA' }, undefined),
      h('circle', { cx: 15.5, cy: 8, r: 1, fill: '#4CC3FA' }, undefined),
      h(
        'path',
        {
          d: 'M3 7V4.5c0-.28.22-.5.5-.5H6',
          stroke: '#F8CE27',
          'stroke-width': 1.5,
          'stroke-linecap': 'square',
          'stroke-linejoin': 'round',
        },
        undefined,
      ),
      h(
        'path',
        {
          d: 'M19 9v2.5a.5.5 0 0 1-.5.5H16',
          stroke: '#F8CE27',
          'stroke-width': 1.5,
          'stroke-linecap': 'square',
          'stroke-linejoin': 'round',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'pincode');
