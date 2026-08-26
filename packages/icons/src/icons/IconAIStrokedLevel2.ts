// Generated from the pinned Semi Design v2.102.0 source. Do not edit directly.
import { h, type VNode } from 'vue';
import { convertIcon, type IconSvgProps } from '../components/Icon';
import { getFillColor } from '../utils';

function renderSvg(props: IconSvgProps): VNode {
  const { fill, ...rest } = props;
  const [primaryColor, secondColor] = getFillColor(fill, 2);
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
      ...rest,
    },
    [
      h(
        'path',
        {
          d: 'M18.16 1.6c.16-.8 1.31-.8 1.48 0a3.54 3.54 0 0 0 2.76 2.76c.8.17.8 1.32 0 1.48a3.54 3.54 0 0 0-2.76 2.76c-.17.8-1.32.8-1.48 0a3.54 3.54 0 0 0-2.76-2.76c-.8-.16-.8-1.31 0-1.48a3.54 3.54 0 0 0 2.76-2.76Z',
          fill: primaryColor,
        },
        undefined,
      ),
      h(
        'path',
        {
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          d: 'M9.68 5.45c.22-1.1 1.8-1.1 2.02 0a8.79 8.79 0 0 0 6.85 6.85c1.1.22 1.1 1.8 0 2.02a8.79 8.79 0 0 0-6.85 6.85c-.22 1.1-1.8 1.1-2.02 0a8.79 8.79 0 0 0-6.85-6.85c-1.1-.22-1.1-1.8 0-2.02a8.79 8.79 0 0 0 6.85-6.85Zm1.01 2.96a10.73 10.73 0 0 1-4.9 4.9 10.73 10.73 0 0 1 4.9 4.9 10.73 10.73 0 0 1 4.9-4.9 10.72 10.72 0 0 1-4.9-4.9Z',
          fill: secondColor,
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'ai_stroked_level_2');
