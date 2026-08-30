import { cloneVNode, defineComponent, isVNode, type PropType, type VNodeChild } from 'vue';

import type { NavigationContent } from './types';

function resolveContent(content: NavigationContent | undefined): VNodeChild {
  return typeof content === 'function' ? content() : content;
}

export default defineComponent({
  name: 'NavigationNodeRenderer',
  props: {
    content: {
      type: null as unknown as PropType<NavigationContent>,
      default: undefined,
    },
  },
  setup(props) {
    return () => {
      const content = resolveContent(props.content);
      return isVNode(content) ? cloneVNode(content) : content;
    };
  },
});
