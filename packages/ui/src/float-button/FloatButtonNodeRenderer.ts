import { Fragment, defineComponent, h, type PropType, type VNodeChild } from 'vue';

export default defineComponent({
  name: 'FloatButtonNodeRenderer',
  props: {
    content: {
      type: null as unknown as PropType<VNodeChild>,
      default: undefined,
    },
  },
  setup(props) {
    return () => h(Fragment, null, [props.content]);
  },
});
