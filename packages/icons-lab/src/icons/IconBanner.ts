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
      h('rect', { x: 6, y: 19, width: 12, height: 1, fill: '#6A6F7F' }, undefined),
      h(
        'rect',
        {
          x: 7.942,
          y: 0.897,
          width: 2,
          height: 22.2633,
          rx: 1,
          transform: 'rotate(10 7.94241 0.896553)',
          fill: '#AAB2BF',
        },
        undefined,
      ),
      h(
        'rect',
        {
          x: 14.085,
          y: 1.229,
          width: 2,
          height: 22.3119,
          rx: 1,
          transform: 'rotate(-10 14.0853 1.22887)',
          fill: '#AAB2BF',
        },
        undefined,
      ),
      h('rect', { x: 1, y: 3, width: 22, height: 14, rx: 2, fill: '#FBCD2C' }, undefined),
      h('rect', { x: 4, y: 6, width: 16, height: 2, fill: '#324350' }, undefined),
      h('rect', { x: 4, y: 11, width: 9, height: 2, fill: '#324350' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'banner');
