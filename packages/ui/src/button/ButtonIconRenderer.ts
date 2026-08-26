import { cloneVNode, defineComponent, Fragment, type PropType, type VNode } from 'vue';

import type { ButtonIconFill } from './types';

/**
 * Vue templates cannot inject the colorful fill contract into arbitrary icon slot VNodes.
 * Keep the render-function boundary isolated here so Button.vue remains declarative.
 */
export default defineComponent({
  name: 'ButtonIconRenderer',
  props: {
    fill: {
      type: [String, Array] as PropType<ButtonIconFill>,
      default: undefined,
    },
    nodes: {
      type: Array as PropType<readonly VNode[]>,
      required: true,
    },
  },
  setup(props) {
    return () =>
      (props.fill === undefined
        ? props.nodes
        : props.nodes.map((node) => cloneVNode(node, { fill: props.fill }))) as unknown as VNode<
        typeof Fragment
      >;
  },
});
