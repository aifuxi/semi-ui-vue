import {
  createTextVNode,
  defineComponent,
  h,
  type CSSProperties,
  type PropType,
  type VNode,
} from 'vue';

import type { HighlightChunk } from './internal-types';

export default defineComponent({
  name: 'HighlightNodeRenderer',
  inheritAttrs: false,
  props: {
    chunks: {
      type: Array as PropType<HighlightChunk[]>,
      required: true,
    },
    component: {
      type: String,
      required: true,
    },
    highlightClassName: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
    highlightStyle: {
      type: Object as PropType<CSSProperties | undefined>,
      default: undefined,
    },
    sourceString: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return (): VNode[] =>
      props.chunks.map((chunk, index) => {
        const text = props.sourceString.slice(chunk.start, chunk.end);
        if (!chunk.highlight) return createTextVNode(text);

        const className = ['semi-highlight-tag', props.highlightClassName, chunk.className]
          .filter(Boolean)
          .join(' ');
        const style = { ...props.highlightStyle, ...chunk.style };
        const nodeProps: { class: string; key: string; style?: CSSProperties } = {
          class: className,
          key: `${text}${index}`,
        };
        if (Object.keys(style).length) nodeProps.style = style;

        return h(props.component, nodeProps, text);
      });
  },
});
