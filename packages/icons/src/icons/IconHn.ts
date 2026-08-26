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
          d: 'M3.5 2.5C4.33 2.5 5 3.17 5 4v6.5h6V4a1.5 1.5 0 0 1 3 0v16a1.5 1.5 0 0 1-3 0v-6.5H5V20a1.5 1.5 0 0 1-3 0V4c0-.83.67-1.5 1.5-1.5Z',
          fill: 'currentColor',
        },
        undefined,
      ),
      h(
        'path',
        {
          d: 'M22.38 19.56v-3.33c0-1.73-.86-2.7-2.4-2.7-1 0-1.87.55-2.12 1.34h-.14c-.05-.85-.52-1.3-1.33-1.3-.83 0-1.35.55-1.35 1.46v4.52c0 .99.5 1.52 1.4 1.52.9 0 1.38-.53 1.38-1.52v-2.6c0-.71.36-1.16.9-1.16.55 0 .88.45.88 1.14v2.62c0 .99.49 1.52 1.39 1.52.9 0 1.39-.52 1.39-1.5Z',
          fill: 'currentColor',
        },
        undefined,
      ),
    ],
  );
}

export default convertIcon(renderSvg, 'hn');
