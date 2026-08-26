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
      h('g', { 'clip-path': 'url(#clip0_1_3057)' }, [
        h(
          'circle',
          { cx: 12, cy: 12, r: 11, transform: 'rotate(-45 12 12)', fill: '#DDE3E8' },
          undefined,
        ),
        h(
          'path',
          { d: 'm4.95 12.24 11.87-5.32-4.58 12.17-1.73-5.46-5.56-1.4Z', fill: '#324350' },
          undefined,
        ),
      ]),
      h('defs', null, [
        h('clipPath', { id: 'clip0_1_3057' }, [
          h('rect', { width: 24, height: 24, fill: 'white' }, undefined),
        ]),
      ]),
    ],
  );
}

export default convertIcon(renderSvg, 'navigation');
