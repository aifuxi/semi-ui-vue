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
          d: 'M12 6c0-1.1.9-2 2-2h5a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2V6Z',
          fill: '#818A9B',
        },
        undefined,
      ),
      h(
        'path',
        {
          d: 'M4 2a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-6a2 2 0 0 1-2-2V4a2 2 0 0 0-2-2H4Z',
          fill: '#DDE3E8',
        },
        undefined,
      ),
      h('rect', { x: 6, y: 12, width: 12, height: 2, fill: '#AAB2BF' }, undefined),
      h('rect', { x: 6, y: 16, width: 9, height: 2, fill: '#AAB2BF' }, undefined),
    ],
  );
}

export default convertIcon(renderSvg, 'tabs');
