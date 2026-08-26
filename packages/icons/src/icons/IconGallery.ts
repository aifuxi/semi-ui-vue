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
      h('rect', { x: 5, y: 9, width: 18, height: 14, rx: 3, fill: 'currentColor' }, undefined),
      h(
        'path',
        {
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          d: 'M15.66.75 2.46 4.22A3 3 0 0 0 .34 7.95l2.35 8.23a3 3 0 0 0 .31.7V11a4 4 0 0 1 4-4h13.5l-1.2-4.18A3 3 0 0 0 15.67.75Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'gallery');
