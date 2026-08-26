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
          d: 'M4.38 4.4c.51-.53 1.34-.53 1.84 0l6.4 6.64c.5.53.5 1.39 0 1.92l-6.4 6.64c-.5.53-1.33.53-1.84 0a1.4 1.4 0 0 1 0-1.91L9.86 12 4.38 6.31a1.4 1.4 0 0 1 0-1.91Z',
          fill: 'currentColor',
        },
        undefined,
      ),
      h(
        'path',
        {
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          d: 'M11.38 4.4c.51-.53 1.33-.53 1.84 0l6.4 6.64c.5.53.5 1.39 0 1.92l-6.4 6.64c-.5.53-1.33.53-1.84 0a1.4 1.4 0 0 1 0-1.91L16.86 12l-5.48-5.69a1.4 1.4 0 0 1 0-1.91Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'double_chevron_right');
