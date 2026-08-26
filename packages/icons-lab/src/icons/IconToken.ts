// Generated from the pinned Semi Design v2.102.0 source. Do not edit directly.
import { h, type VNode } from 'vue';
import { convertIcon, type IconSvgProps } from '../components/Icon';

function renderSvg(props: IconSvgProps): VNode {
  return h(
    'svg',
    {
      viewBox: '0 0 20 20',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      width: '1em',
      height: '1em',
      focusable: false,
      'aria-hidden': true,
      ...props,
    },
    [
      h('rect', { width: 8, height: 8, rx: 4, fill: '#F0B114' }, undefined),
      h('rect', { y: 10, width: 8, height: 8, rx: 4, fill: '#E91E63' }, undefined),
      h('rect', { x: 10, width: 8, height: 8, rx: 4, fill: '#0077FA' }, undefined),
      h('rect', { x: 10, y: 10, width: 8, height: 8, rx: 4, fill: '#00B3A1' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'token');
