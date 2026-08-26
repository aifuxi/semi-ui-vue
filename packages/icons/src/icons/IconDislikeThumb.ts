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
          d: 'm16.94 13.79-3.71 6.96c-.13.24-.42.33-.64.17-.58-.4-1.42-1.2-1.42-2.12 0-.5.13-1.4.27-2.34.15-1.03.31-2.12.31-2.78H4.17c-.45 0-1.17-.46-1.17-1.5 0-.9 1-5.1 1.7-8.05l.3-1.3c0-.22.27-.65 1.33-.65H16.5c.28 0 .5.22.5.5v10.87a.5.5 0 0 1-.06.24Zm4.56-.11a.5.5 0 0 0 .5-.5V2.68a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.5.5v10.5c0 .27.22.5.5.5h2Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'dislike_thumb');
