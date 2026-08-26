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
      h('rect', { x: 1, y: 4, width: 22, height: 16, rx: 2, fill: '#DDE3E8' }, undefined),
      h('rect', { x: 5, y: 8, width: 14, height: 4, fill: '#AAB2BF' }, undefined),
      h('rect', { x: 5, y: 14, width: 8, height: 2, fill: '#AAB2BF' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'card');
