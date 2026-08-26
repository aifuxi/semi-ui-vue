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
          d: 'M20 3c-.83 0-1.5.67-1.5 1.5v16a1.5 1.5 0 0 0 3 0v-16c0-.83-.67-1.5-1.5-1.5Zm-7 5.5a1.5 1.5 0 0 1 3 0v12a1.5 1.5 0 0 1-3 0v-12ZM9 11c-.83 0-1.5.67-1.5 1.5v8a1.5 1.5 0 0 0 3 0v-8c0-.83-.67-1.5-1.5-1.5Zm-5.5 4c-.83 0-1.5.67-1.5 1.5v4a1.5 1.5 0 0 0 3 0v-4c0-.83-.67-1.5-1.5-1.5Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'signal');
