// Generated from the pinned Semi Design v2.102.0 source. Do not edit directly.
import { h, type VNode } from 'vue';
import { convertIcon, type IconSvgProps } from '../components/Icon';

function renderSvg(props: IconSvgProps): VNode {
  return h(
    'svg',
    {
      viewBox: '0 0 25 24',
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
          d: 'M15.5 2a1 1 0 1 0 0 2h5v5a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1h-6Zm-6 20a1 1 0 1 0 0-2h-5v-5a1 1 0 1 0-2 0v6a1 1 0 0 0 1 1h6Zm-6-12a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-5v5a1 1 0 0 1-1 1Zm19 5a1 1 0 1 0-2 0v5h-5a1 1 0 1 0 0 2h6a1 1 0 0 0 1-1v-6Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'indenpent_corners_stroked');
