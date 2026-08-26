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
          d: 'M12 2a10 10 0 0 0 0 20 1.66 1.66 0 0 0 1.23-2.78 1.66 1.66 0 0 1 1.25-2.77h1.96A5.56 5.56 0 0 0 22 10.88C22 5.98 17.52 2 12 2Z',
          fill: '#DDE3E8',
          stroke: '#DDE3E8',
          'stroke-width': 1.5,
        },
        undefined,
      ),
      h('circle', { cx: 6, cy: 12, r: 2, fill: '#F82C2C' }, undefined),
      h('circle', { cx: 10.5, cy: 7, r: 2, fill: '#4CC3FA' }, undefined),
      h('circle', { cx: 17, cy: 9, r: 2, fill: '#3BCE4A' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'color-platte');
