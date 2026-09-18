import {
  cloneVNode,
  defineComponent,
  isVNode,
  type Component,
  type PropType,
  type VNodeChild,
} from 'vue';

import type { NavigationContent } from './types';

function resolveContent(content: NavigationContent | undefined): VNodeChild {
  return typeof content === 'function' ? content() : content;
}

function isSemiIcon(content: VNodeChild): boolean {
  if (!isVNode(content) || typeof content.type === 'string') return false;
  return (content.type as Component & { elementType?: string }).elementType === 'Icon';
}

export default defineComponent({
  name: 'NavigationIconRenderer',
  props: {
    animationClass: { type: String, default: undefined },
    content: {
      type: null as unknown as PropType<NavigationContent>,
      default: undefined,
    },
    force: { type: Boolean, default: false },
    size: { type: String, default: 'large' },
  },
  setup(props) {
    return () => {
      const resolved = resolveContent(props.content);
      // A Vue icon slot wraps its single VNode in an array; preserve the same
      // sizing contract as an icon supplied directly through props.
      const content = Array.isArray(resolved) && resolved.length === 1 ? resolved[0] : resolved;
      if (!isVNode(content)) return content;
      if (!isSemiIcon(content) && !props.force) return cloneVNode(content);
      return cloneVNode(content, {
        class: [content.props?.class, props.animationClass],
        size: props.force ? props.size : content.props?.size || props.size,
      });
    };
  },
});
