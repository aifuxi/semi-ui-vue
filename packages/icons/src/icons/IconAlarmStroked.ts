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
      h('g', { 'clip-path': 'url(#clip0_2342_325)' }, [
        h(
          'path',
          {
            d: 'M12 7.64c.5 0 .9.4.9.9v5.08l3.98 3.97a.9.9 0 1 1-1.29 1.29l-4.18-4.18-.03-.04a.9.9 0 0 1-.29-.66V8.55c0-.5.4-.91.91-.91Z',
            fill: 'currentColor',
          },
          undefined,
        ),
        h(
          'path',
          {
            'fill-rule': 'evenodd',
            'clip-rule': 'evenodd',
            d: 'M12 4a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z',
            fill: 'currentColor',
          },
          undefined,
        ),
        h(
          'path',
          {
            d: 'M3.54 1.41a2 2 0 1 1 2.82 2.83L4.24 6.36a2 2 0 1 1-2.83-2.82L3.54 1.4Z',
            fill: 'currentColor',
          },
          undefined,
        ),
        h(
          'path',
          {
            d: 'M20.46 1.41a2 2 0 1 0-2.82 2.83l2.12 2.12a2 2 0 1 0 2.83-2.82L20.46 1.4Z',
            fill: 'currentColor',
          },
          undefined,
        ),
      ]),
      h('defs', null, [
        h('clipPath', { id: 'clip0_2342_325' }, [
          h('rect', { width: 24, height: 24, fill: 'currentColor' }, undefined),
        ]),
      ]),
    ],
  );
}

export default convertIcon(renderSvg, 'alarm_stroked');
