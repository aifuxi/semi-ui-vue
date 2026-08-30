import {
  Comment,
  Fragment,
  Text,
  cloneVNode,
  computed,
  defineComponent,
  h,
  isVNode,
  markRaw,
  mergeProps,
  onBeforeUnmount,
  onMounted,
  provide,
  shallowRef,
  type CSSProperties,
  type PropType,
  type VNode,
  type VNodeChild,
} from 'vue';
import { BreadcrumbFoundation, type BreadcrumbAdapter } from '@workspace/foundation-integration';
import { IconMore } from '@aifuxi/semi-icons-vue';

import BreadcrumbItem from './BreadcrumbItem.vue';
import BreadcrumbPopover from './BreadcrumbPopover.vue';
import { breadcrumbContextKey } from './breadcrumb-context';
import {
  BREADCRUMB_MORE_TYPES,
  type BreadcrumbItemInfo,
  type BreadcrumbMoreType,
  type BreadcrumbRoute,
  type BreadcrumbShowTooltip,
} from './types';

interface NormalizedRoute extends BreadcrumbRoute {
  _origin: BreadcrumbRoute;
}

function flattenRenderable(nodes: VNodeChild[]): VNode[] {
  const output: VNode[] = [];
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

export default defineComponent({
  name: 'Breadcrumb',
  inheritAttrs: false,
  props: {
    activeIndex: { type: Number, default: undefined },
    autoCollapse: { type: Boolean, default: true },
    className: { type: String, default: undefined },
    compact: { type: Boolean, default: true },
    maxItemCount: { type: Number, default: 4 },
    moreType: {
      type: String as PropType<BreadcrumbMoreType>,
      default: 'default',
      validator: (value: string) => BREADCRUMB_MORE_TYPES.includes(value as BreadcrumbMoreType),
    },
    renderItem: {
      type: Function as PropType<(route: BreadcrumbRoute, index: number) => VNodeChild>,
      default: undefined,
    },
    renderMore: {
      type: Function as PropType<(items: VNodeChild[]) => VNodeChild>,
      default: undefined,
    },
    routes: {
      type: Array as PropType<Array<BreadcrumbRoute | string>>,
      default: () => [],
    },
    separator: {
      type: null as unknown as PropType<VNodeChild>,
      default: '/',
    },
    showTooltip: {
      type: [Boolean, Object] as PropType<boolean | BreadcrumbShowTooltip>,
      default: () => ({ width: 150, ellipsisPos: 'end' as const }),
    },
    style: { type: Object as PropType<CSSProperties>, default: undefined },
  },
  emits: {
    click: (item: BreadcrumbItemInfo, event: MouseEvent | KeyboardEvent) => {
      void item;
      void event;
      return true;
    },
  },
  setup(props, { attrs, emit, slots }) {
    const isCollapsed = shallowRef(true);
    const adapter: BreadcrumbAdapter = {
      notifyClick: (itemInfo, event) => emit('click', itemInfo as BreadcrumbItemInfo, event),
      expandCollapsed: () => {
        isCollapsed.value = false;
      },
    };
    const foundation = markRaw(new BreadcrumbFoundation(adapter));
    const separatorNode = computed<VNodeChild>(() => slots.separator?.() ?? props.separator);

    provide(breadcrumbContextKey, {
      compact: computed(() => props.compact),
      separator: separatorNode,
      showTooltip: computed(() => props.showTooltip),
      onClick: (item, event) => foundation.handleClick(item, event),
    });

    onMounted(() => foundation.init());
    onBeforeUnmount(() => foundation.destroy());

    const expand = (event?: MouseEvent | KeyboardEvent): void => foundation.handleExpand(event);

    function renderRestContent(items: VNode[]): VNodeChild[] {
      const content: VNodeChild[] = [];
      items.forEach((item, index) => {
        content.push(item);
        if (index !== items.length - 1) {
          content.push(
            h('span', { class: 'semi-breadcrumb-restItem', key: `rest-separator-${index}` }, [
              separatorNode.value,
            ]),
          );
        }
      });
      return content;
    }

    function renderMoreContent(items: VNode[]): VNodeChild {
      if (slots.more) return slots.more({ expand, items });
      if (props.renderMore) return props.renderMore(items);
      if (props.moreType === 'popover') {
        return h(
          BreadcrumbPopover,
          { content: renderRestContent(items) },
          { default: () => h(IconMore) },
        );
      }
      return h(IconMore);
    }

    function renderCollapse(items: VNode[], itemLength: number): VNode {
      const hiddenItems = items.slice(1, itemLength - props.maxItemCount + 1);
      return h('span', { class: 'semi-breadcrumb-collapse', key: `more-${itemLength}` }, [
        h('span', { class: 'semi-breadcrumb-item-wrap' }, [
          h(
            'span',
            {
              'aria-label': 'Expand breadcrumb items',
              class: ['semi-breadcrumb-item', 'semi-breadcrumb-item-more'],
              onClick: (event: MouseEvent) => foundation.handleExpand(event),
              onKeypress: (event: KeyboardEvent) => foundation.handleExpandEnterPress(event),
              role: 'button',
              tabindex: 0,
            },
            [renderMoreContent(hiddenItems)],
          ),
          h('span', { class: 'semi-breadcrumb-separator', 'x-semi-prop': 'separator' }, [
            separatorNode.value,
          ]),
        ]),
      ]);
    }

    function routeNodes(
      shouldCollapse: boolean,
      hasCustomMore: boolean,
      moreTypeIsPopover: boolean,
    ): VNode[] {
      const normalized = foundation.genRoutes(props.routes) as NormalizedRoute[];
      const restItemLength = normalized.length - props.maxItemCount;
      return normalized.map((route, index) => {
        const { _origin: origin, ...routeProps } = route;
        const inCollapseArea = index > 0 && index <= restItemLength;
        const content = slots.item
          ? slots.item({ index, route: origin })
          : props.renderItem
            ? props.renderItem(origin, index)
            : route.name;
        const routeKey = origin['key'];
        return h(
          BreadcrumbItem,
          {
            ...routeProps,
            active:
              props.activeIndex === undefined
                ? index === normalized.length - 1
                : props.activeIndex === index,
            key:
              routeKey === undefined
                ? `item-${String(route.name ?? route.path ?? '')}-${index}`
                : String(routeKey),
            route: origin,
            shouldRenderSeparator:
              index !== normalized.length - 1 &&
              !(shouldCollapse && (hasCustomMore || moreTypeIsPopover) && inCollapseArea),
          },
          { default: () => content },
        );
      });
    }

    function childNodes(
      shouldCollapse: boolean,
      hasCustomMore: boolean,
      moreTypeIsPopover: boolean,
    ): VNode[] {
      const children = flattenRenderable((slots.default?.() ?? []) as VNodeChild[]);
      const restItemLength = children.length - props.maxItemCount;
      return children.map((child, index) => {
        const inCollapseArea = index > 0 && index <= restItemLength;
        if (child.type !== BreadcrumbItem) {
          console.warn('[Semi Breadcrumb]: Only accepts Breadcrumb.Item as its children');
          return child;
        }
        return cloneVNode(child, {
          active:
            props.activeIndex === undefined
              ? index === children.length - 1
              : props.activeIndex === index,
          key: `${index}-item`,
          shouldRenderSeparator:
            index !== children.length - 1 &&
            !(shouldCollapse && (hasCustomMore || moreTypeIsPopover) && inCollapseArea),
        });
      });
    }

    function renderList(): VNode[] {
      const itemLength = props.routes.length
        ? props.routes.length
        : flattenRenderable((slots.default?.() ?? []) as VNodeChild[]).length;
      const shouldCollapse =
        props.autoCollapse && itemLength > props.maxItemCount && isCollapsed.value;
      const hasCustomMore = Boolean(slots.more || props.renderMore);
      const moreTypeIsPopover = props.moreType === 'popover';
      const items = props.routes.length
        ? routeNodes(shouldCollapse, hasCustomMore, moreTypeIsPopover)
        : childNodes(shouldCollapse, hasCustomMore, moreTypeIsPopover);
      if (!shouldCollapse) return items;
      const collapsed = [...items];
      collapsed.splice(1, itemLength - props.maxItemCount, renderCollapse(items, itemLength));
      return collapsed;
    }

    return () => {
      const { class: attributeClass, style: attributeStyle, ...rootAttrs } = attrs;
      return h(
        'nav',
        mergeProps(rootAttrs, {
          'aria-label': attrs['aria-label'] ?? 'Breadcrumb',
          class: [
            'semi-breadcrumb-wrapper',
            props.compact ? 'semi-breadcrumb-wrapper-compact' : 'semi-breadcrumb-wrapper-loose',
            props.className,
            attributeClass,
          ],
          style: [props.style, attributeStyle],
        }),
        renderList(),
      );
    };
  },
});
