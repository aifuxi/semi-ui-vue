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
      h('rect', { x: 2, y: 2, width: 20, height: 20, rx: 5, fill: '#41B3FF' }, undefined),
      h('rect', { x: 7, y: 5.5, width: 10, height: 3, rx: 1.5, fill: '#E9E7E7' }, undefined),
      h('rect', { x: 7, y: 10.5, width: 10, height: 3, rx: 1.5, fill: '#483D3D' }, undefined),
      h('rect', { x: 7, y: 15.5, width: 10, height: 3, rx: 1.5, fill: '#E9E7E7' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'webcomponents');
