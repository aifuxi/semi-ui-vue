import {
  Comment,
  Fragment,
  Text,
  cloneVNode,
  defineComponent,
  isVNode,
  type ComponentPublicInstance,
  type PropType,
  type VNode,
  type VNodeChild,
} from 'vue';

function flattenNodes(nodes: VNodeChild[], output: VNode[] = []): VNode[] {
  const visit = (node: VNodeChild): void => {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (!isVNode(node) || node.type === Comment) return;
    if (node.type === Text && String(node.children ?? '').trim() === '') return;
    if (node.type === Fragment && Array.isArray(node.children)) {
      node.children.forEach((child) => visit(child as VNodeChild));
      return;
    }
    output.push(node);
  };
  nodes.forEach(visit);
  return output;
}

function resolveElement(value: Element | ComponentPublicInstance | null): HTMLElement | null {
  if (value instanceof HTMLElement) return value;
  if (!value || value instanceof Element) return null;
  return value.$el instanceof HTMLElement ? value.$el : null;
}

export default defineComponent({
  name: 'DragMoveRenderer',
  inheritAttrs: false,
  props: {
    setElement: {
      type: Function as PropType<(element: HTMLElement | null) => void>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const captureRef = (value: Element | ComponentPublicInstance | null): void => {
      props.setElement(resolveElement(value));
    };

    return () => {
      const nodes = flattenNodes((slots.default?.() ?? []) as VNodeChild[]);
      const node = nodes[0];
      if (nodes.length !== 1 || !node || node.type === Text) {
        throw new Error('DragMove requires exactly one element in the default slot');
      }
      return cloneVNode(node, { ref: captureRef }, true);
    };
  },
});
