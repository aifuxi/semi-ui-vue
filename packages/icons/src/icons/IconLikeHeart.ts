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
          d: 'M12 6c-1.5-3.88-6.25-3.94-8.6-1.6C.87 6.94 1 10.5 3.5 14c2.02 2.83 6.33 6.31 7.9 7.54.36.28.84.28 1.2 0 1.57-1.23 5.88-4.71 7.9-7.54 2.5-3.5 2.63-7.06.1-9.6C18.25 2.06 14.5 2.12 12 6Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'like_heart');
