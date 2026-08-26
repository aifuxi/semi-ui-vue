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
          d: 'M5 2a1 1 0 0 1 1 1v6h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6v2a1 1 0 1 1-2 0v-2H3a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h1V3a1 1 0 0 1 1-1Zm0 15h1v-6H4v6h1Zm11-9a1 1 0 0 1 1-1h1V3a1 1 0 1 1 2 0v4h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1v4a1 1 0 1 1-2 0v-4h-1a1 1 0 0 1-1-1V8Zm4 7h-2V9h2v6ZM10 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1v6a1 1 0 1 0 2 0v-6h1a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-1V3a1 1 0 1 0-2 0v2h-1Zm2 8h-1V7h2v6h-1Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'candlestick_chart_stroked');
