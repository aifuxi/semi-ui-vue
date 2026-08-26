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
          d: 'm14 2 6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2h8Z',
          fill: '#4CC3FA',
        },
        undefined,
      ),
      h(
        'path',
        {
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          d: 'M12.7 9.3a1 1 0 0 0-1.4 0l-3 3a1 1 0 1 0 1.4 1.4l1.3-1.29V17a1 1 0 1 0 2 0v-4.59l1.3 1.3a1 1 0 0 0 1.4-1.42l-3-3Z',
          fill: 'white',
        },
        undefined,
      ),
      h(
        'path',
        {
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          d: 'm20 8-6-6v4c0 1.1.9 2 2 2h4Z',
          fill: '#324350',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'upload');
