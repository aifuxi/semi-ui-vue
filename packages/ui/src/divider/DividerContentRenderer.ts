import { Text, defineComponent, h, type PropType, type VNode } from 'vue';

export default defineComponent({
  name: 'DividerContentRenderer',
  props: {
    nodes: {
      type: Array as PropType<VNode[]>,
      required: true,
    },
  },
  setup(props) {
    return () => {
      if (props.nodes.length === 1 && props.nodes[0]?.type === Text) {
        return h(
          'span',
          {
            class: 'semi-divider_inner-text',
            'x-semi-prop': 'children',
          },
          props.nodes,
        );
      }

      return props.nodes;
    };
  },
});
