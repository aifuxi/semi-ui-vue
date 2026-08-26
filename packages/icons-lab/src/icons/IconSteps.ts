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
          d: 'M14 10a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h4.5a.5.5 0 0 0 .5-.5V14a1 1 0 0 1 1-1h4.5a.5.5 0 0 0 .5-.5V10Z',
          fill: '#AAB2BF',
        },
        undefined,
      ),
      h('rect', { x: 16, y: 5, width: 2, height: 4, fill: '#AAB2BF' }, undefined),
      h('path', { d: 'm23 5-7-3v6l7-3Z', fill: '#F82C2C' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'steps');
