import {
  Fragment,
  cloneVNode,
  defineComponent,
  getCurrentInstance,
  h,
  isVNode,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  type PropType,
  type VNodeChild,
} from 'vue';

function normalizedNodes(content: VNodeChild, output: VNodeChild[] = []): VNodeChild[] {
  if (Array.isArray(content)) {
    for (const node of content) normalizedNodes(node, output);
  } else if (content !== undefined && content !== null && content !== false) {
    output.push(content);
  }
  return output;
}

export default defineComponent({
  name: 'OverflowListNodeRenderer',
  inheritAttrs: false,
  props: {
    content: { type: null as unknown as PropType<VNodeChild>, default: undefined },
    scrollKey: { type: String, default: undefined },
    setElement: {
      type: Function as PropType<(element: unknown) => void>,
      default: undefined,
    },
  },
  setup(props) {
    const instance = getCurrentInstance();
    let currentElement: Element | null = null;

    function syncElement(): void {
      const candidate = instance?.subTree.el;
      const nextElement = candidate instanceof Element ? candidate : null;
      if (nextElement === currentElement) return;
      currentElement = nextElement;
      props.setElement?.(nextElement);
    }

    onMounted(syncElement);
    onUpdated(syncElement);
    onBeforeUnmount(() => props.setElement?.(null));

    return () => {
      const nodes = normalizedNodes(props.content);
      if (props.scrollKey === undefined || props.setElement === undefined) {
        return h(Fragment, null, nodes);
      }
      if (nodes.length === 1 && isVNode(nodes[0]) && nodes[0]!.type !== Fragment) {
        return cloneVNode(nodes[0]!, {
          'data-scrollkey': props.scrollKey,
        });
      }
      return h(
        'span',
        {
          class: 'semi-overflow-list-scroll-item',
          'data-scrollkey': props.scrollKey,
        },
        nodes,
      );
    };
  },
});
