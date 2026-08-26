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
      h('rect', { x: 3, y: 11, width: 18, height: 2, fill: '#AAB2BF' }, undefined),
      h('circle', { cx: 4, cy: 12, r: 3, fill: '#DDE3E8' }, undefined),
      h('circle', { cx: 12, cy: 12, r: 3, fill: '#DDE3E8' }, undefined),
      h('circle', { cx: 20, cy: 12, r: 3, fill: '#4CC3FA' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'timeline');
