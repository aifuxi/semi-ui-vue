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
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          d: 'M16.75 1c.83 0 1.5.67 1.5 1.5v2.7l2.17-1.45a1.5 1.5 0 1 1 1.66 2.5L19.46 8l2.62 1.75a1.5 1.5 0 1 1-1.66 2.5l-2.17-1.45v2.7a1.5 1.5 0 0 1-3 0v-2.7l-2.17 1.45a1.5 1.5 0 0 1-1.66-2.5L14.05 8l-2.63-1.75a1.5 1.5 0 0 1 1.66-2.5l2.17 1.45V2.5c0-.83.67-1.5 1.5-1.5Z',
          fill: 'currentColor',
        },
        undefined,
      ),
      h('circle', { cx: 6.5, cy: 17.5, r: 4.5, fill: 'currentColor' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'reg_exp');
