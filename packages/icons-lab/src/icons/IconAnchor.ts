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
        'path',
        {
          d: 'M6.17 12h-2.5a8.33 8.33 0 1 0 16.66 0h-2.5',
          stroke: '#AAB2BF',
          'stroke-width': 2,
          'stroke-linejoin': 'round',
        },
        undefined,
      ),
      h(
        'path',
        { d: 'M12 20.33V7.83', stroke: '#818A9B', 'stroke-width': 2, 'stroke-linejoin': 'round' },
        undefined,
      ),
      h(
        'path',
        {
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          d: 'M12 9.84a3.09 3.09 0 1 0 0-6.17 3.09 3.09 0 0 0 0 6.17Z',
          fill: '#324350',
          stroke: '#324350',
          'stroke-width': 1.25,
          'stroke-linejoin': 'round',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'anchor');
