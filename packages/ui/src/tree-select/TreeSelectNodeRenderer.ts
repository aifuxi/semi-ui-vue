import { defineComponent, type PropType, type VNodeChild } from 'vue';

export default defineComponent({
  name: 'TreeSelectNodeRenderer',
  props: {
    content: {
      type: null as unknown as PropType<VNodeChild>,
      default: undefined,
    },
  },
  setup(props) {
    return () => props.content;
  },
});
