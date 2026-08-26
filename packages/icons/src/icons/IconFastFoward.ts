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
          d: 'M1 5.96a1 1 0 0 1 1.59-.8l8.3 6.03a1 1 0 0 1 0 1.62l-8.3 6.03a1 1 0 0 1-1.59-.8V5.96Z',
          fill: 'currentColor',
        },
        undefined,
      ),
      h(
        'path',
        {
          d: 'M12 5.96a1 1 0 0 1 1.59-.8l8.3 6.03a1 1 0 0 1 0 1.62l-8.3 6.03a1 1 0 0 1-1.59-.8V5.96Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'fast_foward');
