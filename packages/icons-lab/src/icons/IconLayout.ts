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
      h('rect', { x: 2, y: 2, width: 20, height: 20, rx: 3, fill: '#DDE3E8' }, undefined),
      h('rect', { x: 5, y: 5, width: 14, height: 4, fill: '#6A6F7F' }, undefined),
      h('rect', { x: 11, y: 11, width: 8, height: 3, fill: '#AAB2BF' }, undefined),
      h('rect', { x: 11, y: 16, width: 8, height: 3, fill: '#AAB2BF' }, undefined),
      h('rect', { x: 5, y: 11, width: 4, height: 8, fill: '#AAB2BF' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'layout');
