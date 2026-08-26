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
      h('path', { d: 'M2 5a3 3 0 0 1 3-3h9v20H5a3 3 0 0 1-3-3V5Z', fill: '#DDE3E8' }, undefined),
      h('path', { d: 'M14 2h5a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3h-5V2Z', fill: '#4CC3FA' }, undefined),
      h('rect', { x: 11, y: 8, width: 2, height: 8, rx: 1, fill: '#AAB2BF' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'side-sheet');
