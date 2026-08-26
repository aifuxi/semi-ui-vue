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
          d: 'M12 1a11 11 0 1 1 0 22 11 11 0 0 1 0-22Zm2.1 6.3a1 1 0 0 0-1.42 0L8.8 11.17a1 1 0 0 0 0 1.42l3.9 3.89a1 1 0 0 0 1.4-1.42l-3.18-3.18L14.1 8.7a1 1 0 0 0 0-1.42Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'left-circle');
