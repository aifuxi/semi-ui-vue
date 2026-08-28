import { cloneVNode, defineComponent, isVNode, type PropType, type VNodeChild } from 'vue';

function decorate(content: VNodeChild, size: 'small' | 'default'): VNodeChild {
  if (Array.isArray(content)) return content.map((node) => decorate(node, size));
  if (!isVNode(content)) return content;
  return cloneVNode(content, {
    class: [content.props?.class, 'semi-breadcrumb-item-icon'],
    size,
  });
}

export default defineComponent({
  name: 'BreadcrumbIconRenderer',
  props: {
    compact: { type: Boolean, required: true },
    content: {
      type: null as unknown as PropType<VNodeChild>,
      default: undefined,
    },
  },
  setup: (props) => () => decorate(props.content, props.compact ? 'small' : 'default'),
});
