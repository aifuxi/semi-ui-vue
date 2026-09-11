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
  name: 'NotificationNodeRenderer',
  props: {
    content: {
      type: [String, Number, Boolean, Array, Object] as PropType<VNodeChild>,
      default: undefined,
    },
    // The pinned Notice clones a Semi icon with its explicit size or `large` and renders
    // every other node untouched. Only the notice icon slot passes this.
    iconSize: {
      type: String,
      default: undefined,
    },
  },
  setup(props) {
    return () => {
      const { content, iconSize } = props;
      if (iconSize === undefined || !isSemiIcon(content)) return content;
      return cloneVNode(content, {
        size: (content.props?.size as string | undefined) || iconSize,
      });
    };
  },
});
