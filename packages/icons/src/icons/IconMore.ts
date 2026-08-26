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
        { d: 'M7 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z', fill: 'currentColor' },
        undefined,
      ),
      h(
        'path',
        { d: 'M14.5 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z', fill: 'currentColor' },
        undefined,
      ),
      h(
        'path',
        { d: 'M19.5 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z', fill: 'currentColor' },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'more');
