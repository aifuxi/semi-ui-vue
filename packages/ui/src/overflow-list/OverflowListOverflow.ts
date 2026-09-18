import {
  Comment,
  Fragment,
  createVNode,
  defineComponent,
  h,
  isVNode,
  type PropType,
  type VNode,
  type VNodeChild,
} from 'vue';

import type { OverflowItem, OverflowListCollapseFrom, OverflowListRenderDirection } from './types';

// Vue builds comment/fragment vnodes from global symbols; matching through the global registry
// stays correct when the slot vnode comes from another copy of the runtime.
function isSymbolType(type: unknown, key: string, symbol: unknown): boolean {
  return type === symbol || (typeof type === 'symbol' && Symbol.keyFor(type) === key);
}

/**
 * The pinned implementation calls the overflow renderer during render and only renders the
 * `.semi-overflow-list-overflow` wrapper when that renderer returns an element
 * (`React.isValidElement` / `items.length ? … : null`). Vue slots have to run inside a render too:
 * invoking them from a computed creates VNodes outside the render context, so their content stops
 * patching as soon as the hidden items change. This component keeps both rules in one place.
 */
function hasRenderableContent(content: VNodeChild): boolean {
  if (Array.isArray(content)) return content.some(hasRenderableContent);
  if (content === null || content === undefined || typeof content === 'boolean') return false;
  if (!isVNode(content)) return true;
  // A `v-if` that stays false leaves a comment behind; the fixed renderer returns null instead.
  if (isSymbolType(content.type, 'v-cmt', Comment)) return false;
  if (isSymbolType(content.type, 'v-fgt', Fragment)) {
    const children = (content as VNode).children;
    return Array.isArray(children)
      ? children.some(hasRenderableContent)
      : children !== null && children !== undefined;
  }
  return true;
}

export default defineComponent({
  name: 'OverflowListOverflow',
  props: {
    items: { type: Array as PropType<OverflowItem[]>, required: true },
    position: { type: String as PropType<OverflowListRenderDirection>, required: true },
    renderOverflow: {
      type: Function as PropType<
        (scope: {
          items: readonly OverflowItem[];
          position: OverflowListCollapseFrom;
        }) => VNodeChild
      >,
      required: true,
    },
    // Collapse mode wraps the renderer output in `.semi-overflow-list-overflow`; scroll mode renders
    // the edge groups as siblings of the scroller.
    wrapper: { type: Boolean, default: true },
    setElement: {
      type: Function as PropType<(value: unknown) => void>,
      default: undefined,
    },
  },
  setup:
    (props, { slots }) =>
    () => {
      void slots;
      const scope = {
        items: props.items,
        position: props.position as OverflowListCollapseFrom,
      };
      const content = props.renderOverflow(scope);
      // Vue skips updating a child component whose props did not change even when its stable slot
      // content did, so the hidden items key the rendered fragment: whenever the hidden set changes
      // the subtree is rebuilt and the renderer output stays in sync, which is what the pinned React
      // component gets by re-rendering the renderer result.
      const key = `${props.position}:${props.items
        .map((item) => String(item['key'] ?? ''))
        .join('\u0000')}`;
      const children = Array.isArray(content) ? content : [content];
      if (!props.wrapper) return createVNode(Fragment, { key }, children);
      if (!hasRenderableContent(content)) return null;
      return h(
        'div',
        {
          key,
          ref: (value) => props.setElement?.(value),
          class: 'semi-overflow-list-overflow',
        },
        children,
      );
    },
});
