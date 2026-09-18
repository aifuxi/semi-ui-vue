import { cloneVNode, defineComponent, isVNode, type PropType, type VNodeChild } from 'vue';

export default defineComponent({
  name: 'DescriptionsNodeRenderer',
  props: {
    content: {
      type: null as unknown as PropType<VNodeChild | (() => VNodeChild)>,
      default: undefined,
    },
  },
  setup(props) {
    return () => {
      const content = typeof props.content === 'function' ? props.content() : props.content;
      // Data values can outlive this renderer (for example, a collapsed Table detail).
      // Give each mount its own VNode instead of storing its component/DOM state in user data.
      return isVNode(content) ? cloneVNode(content) : content;
    };
  },
});
