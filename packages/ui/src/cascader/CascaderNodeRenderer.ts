import { defineComponent, type PropType, type VNodeChild } from 'vue';

export default defineComponent({
  name: 'CascaderNodeRenderer',
  props: {
    content: {
      type: null as unknown as PropType<VNodeChild | (() => VNodeChild)>,
      default: undefined,
    },
  },
  setup(props) {
    return () => (typeof props.content === 'function' ? props.content() : props.content);
  },
});
