// Generated from the pinned Semi Design v2.102.0 source. Do not edit directly.
import { h, type VNode } from 'vue';
import { convertIcon, type IconSvgProps } from '../components/Icon';
import { getFillColor, getUuidShort } from '../utils';

function renderSvg(props: IconSvgProps): VNode {
  const { fill, ...rest } = props;
  const id = getUuidShort({ prefix: 'semi-ai-loading' });
  const [stop1, stop2, stop3, stop4] = getFillColor(fill, 4);
  return h(
    'svg',
    {
      viewBox: '0 0 16 16',
      width: '1em',
      height: '1em',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      focusable: false,
      'aria-hidden': true,
      ...rest,
    },
    [
      h(
        'path',
        {
          d: 'M15.1112 7.99978C15.1112 4.07242 11.9275 0.888672 8.00009 0.888672C5.18219 0.888672 2.74711 2.52771 1.59619 4.90445',
          stroke: `url(#${id})`,
          'stroke-width': '1.77778',
          'stroke-linecap': 'round',
        },
        undefined,
      ),
      h('defs', null, [
        h(
          'linearGradient',
          {
            id: id,
            x1: '16',
            y1: '8',
            x2: '2.68594',
            y2: '11.022',
            gradientUnits: 'userSpaceOnUse',
          },
          [
            h('stop', { 'stop-color': stop1 }, undefined),
            h('stop', { offset: '0.3', 'stop-color': stop2 }, undefined),
            h('stop', { offset: '0.6', 'stop-color': stop3 }, undefined),
            h('stop', { offset: '1', 'stop-color': stop4, 'stop-opacity': '0' }, undefined),
          ],
        ),
      ]),
    ],
  );
}

export default convertIcon(renderSvg, 'ai_loading');
