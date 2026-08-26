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
      h('path', { d: 'M2 5c0-1.1.9-2 2-2h7v5H2V5Z', fill: '#3BCE4A' }, undefined),
      h('path', { d: 'M13 3h7a2 2 0 0 1 2 2v3h-9V3Z', fill: '#3BCE4A' }, undefined),
      h('rect', { x: 2, y: 10, width: 9, height: 5, fill: '#AAB2BF' }, undefined),
      h('rect', { x: 13, y: 10, width: 9, height: 5, fill: '#DDE3E8' }, undefined),
      h('path', { d: 'M2 17h9v5H4a2 2 0 0 1-2-2v-3Z', fill: '#DDE3E8' }, undefined),
      h('path', { d: 'M13 17h9v3a2 2 0 0 1-2 2h-7v-5Z', fill: '#AAB2BF' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'table');
