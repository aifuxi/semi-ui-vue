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
          d: 'm5.1 18-.6 2.17a1.45 1.45 0 0 0 2.8.77L8.1 18h4l-.6 2.17a1.45 1.45 0 0 0 2.8.77l.8-2.94h4.4a1.5 1.5 0 0 0 0-3h-3.57l1.64-6h2.93a1.5 1.5 0 0 0 0-3h-2.1l.6-2.17a1.45 1.45 0 1 0-2.8-.77L15.4 6h-4l.6-2.17a1.45 1.45 0 1 0-2.8-.77L8.4 6H4.5a1.5 1.5 0 1 0 0 3h3.08l-1.66 6H3.5a1.5 1.5 0 0 0 0 3h1.6Zm3.83-3 1.64-6h4l-1.64 6h-4Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'hash');
