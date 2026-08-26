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
      h('g', { 'clip-path': 'url(#clip_triangle_arrow)' }, [
        h(
          'path',
          {
            d: 'M24 9v1c-4 0-5.5 1-7.5 3S14 16 12 16s-2.5-1-4.5-3S4 10 0 10V9h24Z',
            fill: 'currentColor',
          },
          undefined,
        ),
      ]),
      h('defs', null, [
        h('clipPath', { id: 'clip_triangle_arrow' }, [
          h(
            'rect',
            { width: 24, height: 24, fill: 'currentColor', transform: 'translate(24) rotate(90)' },
            undefined,
          ),
        ]),
      ]),
    ],
  );
}

export default convertIcon(renderSvg, 'triangle_arrow');
