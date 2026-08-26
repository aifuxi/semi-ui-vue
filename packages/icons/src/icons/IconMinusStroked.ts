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
    [h('path', { d: 'M3 13a1 1 0 1 1 0-2h18a1 1 0 1 1 0 2H3Z', fill: 'currentColor' }, undefined)],
  );
}

export default convertIcon(renderSvg, 'minus_stroked');
