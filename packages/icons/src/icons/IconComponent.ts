// Generated from the pinned Semi Design v2.102.0 source. Do not edit directly.
import { h, type VNode } from 'vue';
import { convertIcon, type IconSvgProps } from '../components/Icon';

function renderSvg(props: IconSvgProps): VNode {
  return h(
    'svg',
    {
      viewBox: '0 0 22 22',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      width: '1em',
      height: '1em',
      focusable: false,
      'aria-hidden': true,
      ...props,
    },
    [
      h('path', { d: 'm6 4 5-4 5 4-5 5.5L6 4Z', fill: 'currentColor' }, undefined),
      h('path', { d: 'm18 6 4 5-4 5-5.5-5L18 6Z', fill: 'currentColor' }, undefined),
      h('path', { d: 'm4 16-4-5 4-5 5.5 5L4 16Z', fill: 'currentColor' }, undefined),
      h('path', { d: 'm16 18-5 4-5-4 5-5.5 5 5.5Z', fill: 'currentColor' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'component');
