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
      h('rect', { x: 2, y: 1, width: 20, height: 10, rx: 5, fill: '#DDE3E8' }, undefined),
      h('circle', { cx: 7.5, cy: 5.99997, r: 3.5, fill: 'white' }, undefined),
      h('rect', { x: 2, y: 13, width: 20, height: 10, rx: 5, fill: '#3BCE4A' }, undefined),
      h('circle', { cx: 16.5, cy: 18, r: 3.5, fill: 'white' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'switch');
