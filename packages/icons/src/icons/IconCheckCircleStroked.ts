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
          d: 'M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22Zm9-11a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-4.23-2.36a1 1 0 1 0-1.54-1.28l-4.3 5.16-2.22-2.23a1 1 0 0 0-1.42 1.42l3 3a1 1 0 0 0 1.48-.07l5-6Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'check_circle_stroked');
