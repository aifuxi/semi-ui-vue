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
          d: 'M4.22 4.22a10.97 10.97 0 0 1 15.56 0l-.7.7.7-.7a10.97 10.97 0 0 1 0 15.56 10.97 10.97 0 0 1-15.56 0l.7-.7-.7.7a10.97 10.97 0 0 1 0-15.56ZM12 3a8.97 8.97 0 0 0-9 9 8.97 8.97 0 0 0 9 9 8.97 8.97 0 0 0 9-9 8.97 8.97 0 0 0-9-9Z',
          fill: 'currentColor',
        },
        undefined,
      ),
      h(
        'path',
        {
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          d: 'M8 9.31a4 4 0 1 1 5 3.88v1.12a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1 2 2 0 1 0-2-2 1 1 0 0 1-2 0Z',
          fill: 'currentColor',
        },
        undefined,
      ),
      h(
        'path',
        {
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          d: 'M12 18.81a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'help_circle_stroked');
