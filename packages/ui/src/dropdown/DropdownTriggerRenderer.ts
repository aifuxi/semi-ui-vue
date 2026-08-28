import {
  Comment,
  Fragment,
  Text,
  cloneVNode,
  defineComponent,
  h,
  isVNode,
  mergeProps,
  type ComponentPublicInstance,
  type PropType,
  type VNode,
  type VNodeChild,
} from 'vue';

type TriggerEvent = MouseEvent | FocusEvent | KeyboardEvent;
type TriggerHandler = (event: TriggerEvent) => void;
type EventHandler = TriggerHandler | TriggerHandler[];

function flattenNodes(nodes: VNodeChild[]): VNode[] {
  const result: VNode[] = [];
  const visit = (node: VNodeChild): void => {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (!isVNode(node) || node.type === Comment) return;
    if (node.type === Fragment && Array.isArray(node.children)) {
      node.children.forEach((child) => visit(child as VNodeChild));
      return;
    }
    result.push(node);
  };
  nodes.forEach(visit);
  return result;
}

function invoke(handler: EventHandler | undefined, event: TriggerEvent): void {
  if (Array.isArray(handler)) handler.forEach((entry) => entry(event));
  else handler?.(event);
}

export default defineComponent({
  name: 'DropdownTriggerRenderer',
  inheritAttrs: false,
  props: {
    eventSet: {
      type: Object as PropType<Record<string, TriggerHandler>>,
      required: true,
    },
    popupId: { type: String, required: true },
    prefixCls: { type: String, required: true },
    setTriggerElement: {
      type: Function as PropType<(element: HTMLElement | null) => void>,
      required: true,
    },
    visible: Boolean,
  },
  setup(props, { slots }) {
    return () => {
      const nodes = flattenNodes((slots.default?.() ?? []) as VNodeChild[]);
      const node = nodes.length === 1 ? nodes[0] : undefined;
      const target =
        node && node.type !== Text
          ? node
          : h(
              'span',
              { style: { display: node?.type === Text ? undefined : 'inline-block' } },
              nodes,
            );
      const original = target.props ?? {};
      const eventNames = new Set([...Object.keys(props.eventSet), 'onKeydown']);
      const originalRest = Object.fromEntries(
        Object.entries(original).filter(([key]) => !eventNames.has(key)),
      );
      const merged = mergeProps(originalRest, {
        'aria-expanded': String(props.visible),
        'aria-haspopup': 'true',
        class: [original.class, props.visible ? `${props.prefixCls}-showing` : undefined],
        'data-popupid': props.popupId,
        tabindex: original.tabindex ?? original.tabIndex ?? 0,
      });
      for (const eventName of eventNames) {
        const internal = props.eventSet[eventName];
        const user = original[eventName] as EventHandler | undefined;
        if (!internal && !user) continue;
        merged[eventName] = (event: TriggerEvent) => {
          internal?.(event);
          invoke(user, event);
        };
      }
      const cloned = cloneVNode(target);
      cloned.props = merged;
      cloned.patchFlag = -2;
      const captureRef = (value: Element | ComponentPublicInstance | null): void => {
        if (value instanceof HTMLElement) {
          props.setTriggerElement(value);
        } else if (value && !(value instanceof Element) && value.$el instanceof HTMLElement) {
          props.setTriggerElement(value.$el);
        } else {
          props.setTriggerElement(null);
        }
      };
      const withRef = cloneVNode(cloned, { ref: captureRef }, true);
      withRef.patchFlag = -2;
      return withRef;
    };
  },
});
