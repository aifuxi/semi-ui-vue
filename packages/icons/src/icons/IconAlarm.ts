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
          d: 'm3.48 6 2.5-2.5A1.77 1.77 0 1 0 3.48 1L.98 3.5A1.77 1.77 0 0 0 3.48 6Z',
          fill: 'currentColor',
        },
        undefined,
      ),
      h(
        'path',
        {
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          d: 'M12 23a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm1.5-15v4.07L17 14a1.5 1.5 0 1 1-1.34 2.68l-4.33-2.34A1.5 1.5 0 0 1 10.5 13V8a1.5 1.5 0 0 1 3 0Z',
          fill: 'currentColor',
        },
        undefined,
      ),
      h(
        'path',
        {
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          d: 'M18 3.5 20.5 6A1.77 1.77 0 0 0 23 3.5L20.5 1A1.77 1.77 0 1 0 18 3.5Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'alarm');
