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
      h('rect', { x: 1, y: 4, width: 22, height: 16, rx: 3, fill: '#DDE3E8' }, undefined),
      h('circle', { cx: 6, cy: 12, r: 2, fill: '#6A6F7F' }, undefined),
      h('circle', { cx: 12, cy: 12, r: 2, fill: '#6A6F7F' }, undefined),
      h('circle', { cx: 18, cy: 12, r: 2, fill: '#6A6F7F' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'overflow');
