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
          d: 'M11.94 22a1.5 1.5 0 0 1-1.5-1.5v-9.38L8.06 13.5a1.5 1.5 0 1 1-2.12-2.12l4.94-4.94a1.5 1.5 0 0 1 2.12 0l5.06 5.06a1.5 1.5 0 1 1-2.12 2.12l-2.5-2.5v9.38c0 .83-.67 1.5-1.5 1.5Z',
          fill: 'currentColor',
        },
        undefined,
      ),
      h(
        'path',
        {
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          d: 'M19.44 2a1.5 1.5 0 1 1 0 3h-15a1.5 1.5 0 1 1 0-3h15Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'align_top');
