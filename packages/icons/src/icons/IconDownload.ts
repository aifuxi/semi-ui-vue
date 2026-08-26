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
          d: 'M17.84 8.06A6.5 6.5 0 1 0 5.18 11 4.5 4.5 0 0 0 5.5 20H17a6 6 0 0 0 .84-11.94Zm-6.16 9.67a.5.5 0 0 0 .64 0l5.15-4.29a.25.25 0 0 0-.16-.44H14V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V13H6.7c-.24 0-.35.3-.17.44l5.15 4.3Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'download');
