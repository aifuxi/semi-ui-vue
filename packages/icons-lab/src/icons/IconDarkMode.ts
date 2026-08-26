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
      h('circle', { cx: 12, cy: 12, r: 11, fill: '#324350' }, undefined),
      h(
        'path',
        {
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          d: 'M18 15.95a7.29 7.29 0 0 1-7.41-11.12A7.3 7.3 0 1 0 18 15.95Z',
          fill: '#FBCD2C',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'dark-mode');
