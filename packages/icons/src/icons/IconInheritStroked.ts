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
          d: 'M2 4.5C2 3.67 2.67 3 3.5 3h17c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5H9v5h5v-1.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5h-5a1.5 1.5 0 0 1-1.5-1.5V18H8a1 1 0 0 1-1-1v-6H3.5A1.5 1.5 0 0 1 2 9.5v-5ZM7 9h13V5H4v4h3Zm13 6h-4v4h4v-4Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'inherit_stroked');
