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
          d: 'M4.5 3c0-1.1.9-2 2-2h11a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2V3Zm13 0h-11v18h11V3ZM10 18a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-4Zm4.77-8.36a1 1 0 1 0-1.54-1.28l-1.8 2.16-.72-.73a1 1 0 1 0-1.42 1.42l1.5 1.5a1 1 0 0 0 1.48-.07l2.5-3Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'smartphone_check_stroked');
