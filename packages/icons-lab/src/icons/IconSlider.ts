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
      h('rect', { x: 5, y: 4, width: 17, height: 2, rx: 1, fill: '#AAB2BF' }, undefined),
      h('rect', { x: 2, y: 11, width: 18, height: 2, rx: 1, fill: '#4CC3FA' }, undefined),
      h('rect', { x: 5, y: 18, width: 17, height: 2, rx: 1, fill: '#AAB2BF' }, undefined),
      h('circle', { cx: 5.5, cy: 5, r: 3.5, fill: '#DDE3E8' }, undefined),
      h('circle', { cx: 18.5, cy: 12, r: 3.5, fill: '#DDE3E8' }, undefined),
      h('circle', { cx: 5.5, cy: 19, r: 3.5, fill: '#DDE3E8' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'slider');
