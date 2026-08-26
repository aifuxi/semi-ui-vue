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
      h('rect', { x: 2, y: 11, width: 21, height: 3, fill: '#DDE3E8' }, undefined),
      h('rect', { x: 2, y: 15, width: 21, height: 3, fill: '#DDE3E8' }, undefined),
      h('rect', { x: 11, y: 2, width: 12, height: 3, fill: '#AAB2BF' }, undefined),
      h('rect', { x: 11, y: 6, width: 9, height: 3, fill: '#AAB2BF' }, undefined),
      h('rect', { x: 2, y: 19, width: 11, height: 3, fill: '#DDE3E8' }, undefined),
      h('rect', { x: 2, y: 2, width: 7, height: 7, fill: '#6A6F7F' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'skeleton');
