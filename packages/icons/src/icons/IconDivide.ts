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
        { d: 'M14.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z', fill: 'currentColor' },
        undefined,
      ),
      h(
        'path',
        {
          d: 'M2 12c0-.83.67-1.5 1.5-1.5h17a1.5 1.5 0 0 1 0 3h-17A1.5 1.5 0 0 1 2 12Z',
          fill: 'currentColor',
        },
        undefined,
      ),
      h(
        'path',
        { d: 'M12 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z', fill: 'currentColor' },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'divide');
