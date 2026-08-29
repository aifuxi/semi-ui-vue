import {
  cloneVNode,
  defineComponent,
  isVNode,
  type Component,
  type PropType,
  type VNode,
  type VNodeChild,
} from 'vue';

function isSemiIcon(content: VNodeChild): content is VNode {
  if (!isVNode(content) || typeof content.type === 'string') return false;
  return (content.type as Component & { elementType?: string }).elementType === 'Icon';
}

export default defineComponent({
  name: 'ToastIconRenderer',
  props: {
    content: {
      type: null as unknown as PropType<VNodeChild>,
      default: undefined,
    },
  },
  setup(props) {
    return () =>
      isSemiIcon(props.content)
        ? cloneVNode(props.content, { class: 'semi-toast-icon', size: 'large' })
        : props.content;
  },
});
