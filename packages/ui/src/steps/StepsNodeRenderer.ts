import { cloneVNode, defineComponent, isVNode, type PropType, type VNodeChild } from 'vue';

export default defineComponent({
  name: 'StepsNodeRenderer',
  props: {
    content: { type: null as unknown as PropType<VNodeChild>, default: undefined },
  },
  setup: (props) => () => (isVNode(props.content) ? cloneVNode(props.content) : props.content),
});
