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
          d: 'M11 3a1.25 1.25 0 0 0-2.42-.44L1.83 20.3A1.25 1.25 0 0 0 3 22h6.75c.69 0 1.25-.56 1.25-1.25V3ZM8.5 19.5H4.81L8.5 9.8v9.7Z',
          fill: 'currentColor',
        },
        undefined,
      ),
      h(
        'path',
        {
          d: 'M14.02 1.77C13.43 1.88 13 2.4 13 3v17.75c0 .69.56 1.25 1.25 1.25H21a1.25 1.25 0 0 0 1.17-1.7L15.42 2.57c-.22-.57-.8-.9-1.4-.79Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'flip_horizontal');
