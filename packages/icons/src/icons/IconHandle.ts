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
      h('path', { d: 'M9 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z', fill: 'currentColor' }, undefined),
      h('path', { d: 'M9 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z', fill: 'currentColor' }, undefined),
      h('path', { d: 'M11 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z', fill: 'currentColor' }, undefined),
      h('path', { d: 'M15 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z', fill: 'currentColor' }, undefined),
      h('path', { d: 'M17 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z', fill: 'currentColor' }, undefined),
      h('path', { d: 'M15 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z', fill: 'currentColor' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'handle');
