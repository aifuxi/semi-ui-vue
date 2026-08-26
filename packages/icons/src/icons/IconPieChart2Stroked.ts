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
          d: 'M11 3.05a9 9 0 1 0 6.62 15.98l-6.47-6.47a.5.5 0 0 1-.15-.35V3.05Zm2 0V11h7.95A9 9 0 0 0 13 3.05ZM14.41 13l4.62 4.62A8.96 8.96 0 0 0 20.95 13H14.4ZM1 12a11 11 0 1 1 22 0 11 11 0 0 1-22 0Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'pie_chart_2_stroked');
