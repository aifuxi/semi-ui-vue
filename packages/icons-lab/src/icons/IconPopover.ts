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
      h('rect', { x: 9, y: 9, width: 13, height: 13, rx: 2, fill: '#6A6F7F' }, undefined),
      h('rect', { x: 2, y: 7, width: 12, height: 12, rx: 2, fill: '#AAB2BF' }, undefined),
      h('rect', { x: 8, y: 2, width: 11, height: 11, rx: 2, fill: '#DDE3E8' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'popover');
