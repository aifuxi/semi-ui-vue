import {
  Comment,
  Fragment,
  Text,
  cloneVNode,
  defineComponent,
  h,
  isVNode,
  type ComponentPublicInstance,
  type PropType,
  type VNode,
  type VNodeChild,
} from 'vue';

import type { TooltipTrigger } from './types';

type EventHandler = (...args: unknown[]) => void;

const blockDisplays = new Set(['flex', 'block', 'table', 'flow-root', 'grid']);

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

function resolveElement(value: Element | ComponentPublicInstance | null): HTMLElement | null {
  if (value instanceof HTMLElement) return value;
  if (!value || value instanceof Element) return null;
  const element = value.$el;
  return element instanceof HTMLElement ? element : null;
}

function componentName(node: VNode): string | undefined {
  if (typeof node.type === 'string' || typeof node.type === 'symbol') return undefined;
  const type = node.type as { __name?: string; elementType?: string; name?: string };
  return type.elementType ?? type.name ?? type.__name;
}

function hasEnabledBooleanProp(node: VNode, name: string): boolean {
  return Boolean(
    node.props &&
    Object.prototype.hasOwnProperty.call(node.props, name) &&
    node.props[name] !== false,
  );
}

export default defineComponent({
  name: 'TooltipTriggerRenderer',
  props: {
    eventSet: {
      type: Object as PropType<Record<string, EventHandler>>,
      required: true,
    },
    popupId: {
      type: String,
      default: undefined,
    },
    role: {
      type: String,
      required: true,
    },
    trigger: {
      type: String as PropType<TooltipTrigger>,
      required: true,
    },
    visible: Boolean,
    wrapWhenSpecial: Boolean,
    wrapperClassName: {
      type: null,
      default: undefined,
    },
    setTriggerElement: {
      type: Function as PropType<(element: HTMLElement | null) => void>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const captureRef = (value: Element | ComponentPublicInstance | null): void => {
      props.setTriggerElement(resolveElement(value));
    };

    const decorate = (node: VNode, extraStyle?: Record<string, string>): VNode => {
      const originalProps = node.props ?? {};
      const aria =
        props.role === 'dialog'
          ? {
              'aria-controls': props.popupId,
              'aria-expanded': String(props.visible),
              'aria-haspopup': 'dialog',
            }
          : { 'aria-describedby': props.popupId };
      const explicitTabindex = originalProps.tabindex ?? originalProps.tabIndex;
      return cloneVNode(
        node,
        {
          ...aria,
          ...props.eventSet,
          'data-popupid': props.popupId,
          ref: captureRef,
          style: [originalProps.style, extraStyle],
          tabindex: explicitTabindex ?? 0,
        },
        true,
      );
    };

    return () => {
      const nodes = flattenNodes((slots.default?.() ?? []) as VNodeChild[]);
      const single = nodes.length === 1 ? nodes[0] : undefined;
      const isText = single?.type === Text;
      const isElement = Boolean(single && !isText);
      const disabled = Boolean(single && hasEnabledBooleanProp(single, 'disabled'));
      const loading = Boolean(single && hasEnabledBooleanProp(single, 'loading'));
      const name = single ? componentName(single) : undefined;
      const special = disabled || (loading && (name === 'Button' || name === 'IconButton'));
      const shouldWrapSpecial = props.wrapWhenSpecial && special && props.trigger !== 'custom';

      if (isElement && single && !shouldWrapSpecial) {
        return decorate(
          single,
          props.wrapWhenSpecial && special ? { pointerEvents: 'none' } : undefined,
        );
      }

      const childNodes =
        single && shouldWrapSpecial
          ? [cloneVNode(single, { style: [single.props?.style, { pointerEvents: 'none' }] })]
          : nodes;
      const childDisplay = single?.props?.style?.display;
      const block = Boolean(single?.props?.block) || blockDisplays.has(childDisplay);
      const wrapperStyle: Record<string, string> = {};
      if (!isText) wrapperStyle.display = 'inline-block';
      if (block) wrapperStyle.width = '100%';
      if (shouldWrapSpecial && disabled) wrapperStyle.cursor = 'not-allowed';

      return decorate(
        h(
          'span',
          {
            class: props.wrapperClassName,
            style: wrapperStyle,
          },
          childNodes,
        ),
      );
    };
  },
});
