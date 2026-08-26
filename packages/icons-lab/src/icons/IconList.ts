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
      h('path', { d: 'M2 4a1 1 0 0 1 1-1h3v5H3a1 1 0 0 1-1-1V4Z', fill: '#0077FA' }, undefined),
      h('path', { d: 'M8 3h13a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H8V3Z', fill: '#4CC3FA' }, undefined),
      h('path', { d: 'M2 11a1 1 0 0 1 1-1h3v5H3a1 1 0 0 1-1-1v-3Z', fill: '#AAB2BF' }, undefined),
      h('path', { d: 'M8 10h13a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H8v-5Z', fill: '#DDE3E8' }, undefined),
      h('path', { d: 'M2 18a1 1 0 0 1 1-1h3v5H3a1 1 0 0 1-1-1v-3Z', fill: '#AAB2BF' }, undefined),
      h('path', { d: 'M8 17h13a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H8v-5Z', fill: '#DDE3E8' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'list');
