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
      h(
        'circle',
        { cx: 12, cy: 12, r: 10.25, fill: 'white', stroke: '#AAB2BF', 'stroke-width': 1.5 },
        undefined,
      ),
      h(
        'path',
        {
          d: 'M14.5 6.5 12 12l5 5.5',
          stroke: '#6A6F7F',
          'stroke-width': 2.5,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
        undefined,
      ),
      h('circle', { cx: 12, cy: 12, r: 2, fill: '#324350' }, undefined),
      h(
        'path',
        { d: 'M13 11.63 12 12l-7 3', stroke: '#FBCD2C', 'stroke-linecap': 'round' },
        undefined,
      ),
      h('circle', { cx: 12, cy: 12, r: 1, fill: '#FBCD2C' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'time-picker');
