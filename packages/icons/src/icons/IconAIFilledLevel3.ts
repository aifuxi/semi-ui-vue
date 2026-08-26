// Generated from the pinned Semi Design v2.102.0 source. Do not edit directly.
import { h, type VNode } from 'vue';
import { convertIcon, type IconSvgProps } from '../components/Icon';
import { getFillColor, getUuidShort } from '../utils';

function renderSvg(props: IconSvgProps): VNode {
  const { fill, ...rest } = props;
  const id = getUuidShort({ prefix: 'semi-ai-filled-level-3' });
  const [stop1, stop2, stop3, stop4] = getFillColor(fill, 4);
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
      ...rest,
    },
    [
      h(
        'path',
        {
          d: 'M9.68 5.45c.22-1.1 1.8-1.1 2.02 0a8.79 8.79 0 0 0 6.85 6.85c1.1.22 1.1 1.8 0 2.02a8.79 8.79 0 0 0-6.85 6.85c-.22 1.1-1.8 1.1-2.02 0a8.79 8.79 0 0 0-6.85-6.85c-1.1-.22-1.1-1.8 0-2.02a8.79 8.79 0 0 0 6.85-6.85Zm8.48-3.85c.16-.8 1.31-.8 1.48 0a3.54 3.54 0 0 0 2.76 2.76c.8.17.8 1.32 0 1.48a3.54 3.54 0 0 0-2.76 2.76c-.17.8-1.32.8-1.48 0a3.54 3.54 0 0 0-2.76-2.76c-.8-.16-.8-1.31 0-1.48a3.54 3.54 0 0 0 2.76-2.76Z',
          fill: `url(#${id})`,
        },
        undefined,
      ),
      h('defs', null, [
        h(
          'linearGradient',
          { id: id, x1: 23, y1: 22, x2: -0.488628, y2: 18.6969, gradientUnits: 'userSpaceOnUse' },
          [
            h('stop', { 'stop-color': stop1 }, undefined),
            h('stop', { offset: 0.3, 'stop-color': stop2 }, undefined),
            h('stop', { offset: 0.6, 'stop-color': stop3 }, undefined),
            h('stop', { offset: 1, 'stop-color': stop4 }, undefined),
          ],
        ),
      ]),
    ],
  );
}

export default convertIcon(renderSvg, 'ai_filled_level_3');
