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
      h('rect', { x: 10.5, y: 7.5, width: 11, height: 11, rx: 2, fill: '#DDE3E8' }, undefined),
      h('rect', { x: 2.5, y: 7.5, width: 12, height: 11, rx: 2, fill: '#AAB2BF' }, undefined),
      h('rect', { x: 5, y: 5.5, width: 14, height: 13, rx: 2, fill: '#6A6F7F' }, undefined),
      h(
        'path',
        {
          d: 'M12.18 10.7a1.58 1.58 0 0 1 2.64 0l1.97 3.18c.59.94-.14 2.12-1.31 2.12h-3.96c-1.17 0-1.9-1.18-1.31-2.12l1.97-3.17Z',
          fill: '#DDE3E8',
        },
        undefined,
      ),
      h('circle', { cx: 8.5, cy: 9.5, r: 1.5, fill: 'white' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'carousel');
