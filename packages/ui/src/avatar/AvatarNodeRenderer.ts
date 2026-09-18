import { cloneVNode, defineComponent, isVNode, type PropType, type VNodeChild } from 'vue';

export default defineComponent({
  name: 'AvatarNodeRenderer',
  props: {
    node: { type: null as unknown as PropType<VNodeChild>, default: undefined },
  },
  // Vue vnodes belong to the tree they were mounted in, while the documented slot config may be
  // shared by several avatars. Clone before rendering so a shared config keeps rendering on every
  // instance, matching the pinned React element semantics.
  setup: (props) => () => (isVNode(props.node) ? cloneVNode(props.node) : props.node),
});
