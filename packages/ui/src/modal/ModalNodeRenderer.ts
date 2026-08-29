import { defineComponent, type PropType, type VNodeChild } from 'vue';

export default defineComponent({
  name: 'ModalNodeRenderer',
  props: {
    content: {
      type: [String, Number, Boolean, Array, Object] as PropType<VNodeChild>,
      default: undefined,
    },
  },
  setup(props) {
    return () => props.content;
  },
});
