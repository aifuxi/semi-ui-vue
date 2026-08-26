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
          d: 'M12 2a6.5 6.5 0 0 0-6.5 6.5V10H5a2 2 0 0 0-2 2v8c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-.5V8.5A6.5 6.5 0 0 0 12 2Zm3.5 8V8.5a3.5 3.5 0 1 0-7 0V10h7Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'lock');
