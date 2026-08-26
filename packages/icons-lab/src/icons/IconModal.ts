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
      h('rect', { x: 2, y: 2, width: 20, height: 20, rx: 3, fill: '#AAB2BF' }, undefined),
      h('rect', { x: 4, y: 6, width: 16, height: 12, rx: 1, fill: 'white' }, undefined),
      h('rect', { x: 6, y: 13, width: 5, height: 3, rx: 1, fill: '#AAB2BF' }, undefined),
      h('rect', { x: 13, y: 13, width: 5, height: 3, rx: 1, fill: '#4CC3FA' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'modal');
