import { defineComponent, type PropType, type VNode, type VNodeChild } from 'vue';

export default defineComponent({
  name: 'SelectOptionCollector',
  props: {
    collect: {
      type: Function as PropType<(nodes: VNodeChild) => void>,
      required: true,
    },
  },
  setup(props, { slots }) {
    return () => {
      const nodes = (slots.default?.() ?? []) as VNode[];
      props.collect(nodes);
      return null;
    };
  },
});
