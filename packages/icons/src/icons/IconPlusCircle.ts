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
          d: 'M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22Zm7-11.12a1.5 1.5 0 0 1-1.47 1.52l-4 .07.07 4a1.5 1.5 0 0 1-3 .06l-.07-4-4 .07a1.5 1.5 0 0 1-.06-3l4-.07-.07-4a1.5 1.5 0 1 1 3-.06l.07 4 4-.07A1.5 1.5 0 0 1 19 11.88Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'plus_circle');
