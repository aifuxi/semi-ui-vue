import {
  Comment,
  Fragment,
  Text,
  computed,
  defineComponent,
  h,
  inject,
  isVNode,
  markRaw,
  mergeProps,
  nextTick,
  onBeforeUnmount,
  onMounted,
  type PropType,
  type VNode,
  type VNodeChild,
} from 'vue';
import {
  NavigationItemFoundation,
  type NavigationItemAdapter,
} from '@workspace/foundation-integration';

import { DropdownItem } from '../dropdown';
import Tooltip from '../tooltip/Tooltip.vue';
import NavigationIconRenderer from './NavigationIconRenderer';
import NavigationNodeRenderer from './NavigationNodeRenderer';
import { navigationContextKey } from './navigation-context';
import type {
  ItemKey,
  NavigationContent,
  NavigationSelectData,
  NavItemProps,
  NavItemSelectedData,
  SubNavProps,
} from './types';

interface NavItemState {
  tooltipShow: boolean;
}

function renderableSlot(nodes: VNodeChild[] | undefined): VNodeChild[] | undefined {
  if (!nodes) return undefined;
  const output: VNodeChild[] = [];
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
    if (node.type === Text && String(node.children ?? '').trim() === '') return;
    output.push(node);
  };
  nodes.forEach(visit);
  return output;
}

function clonePayload(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(clonePayload);
  if (isVNode(value)) return value;
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, clonePayload(item)]));
}

export default defineComponent({
  name: 'NavItem',
  inheritAttrs: false,
  props: {
    class: { type: null as unknown as PropType<NavItemProps['class']>, default: undefined },
    className: {
      type: null as unknown as PropType<NavItemProps['className']>,
      default: undefined,
    },
    disabled: { type: Boolean, default: false },
    forwardRef: {
      type: Function as PropType<(element: HTMLLIElement | null) => void>,
      default: undefined,
    },
    icon: { type: null as unknown as PropType<NavigationContent>, default: undefined },
    indent: {
      type: [Boolean, Number] as PropType<boolean | number>,
      default: false,
    },
    isCollapsed: { type: Boolean, default: false },
    isSubNav: { type: Boolean, default: false },
    itemKey: { type: [String, Number] as PropType<ItemKey>, default: undefined },
    level: { type: Number, default: 0 },
    link: { type: String, default: undefined },
    linkOptions: {
      type: Object as PropType<NavItemProps['linkOptions']>,
      default: undefined,
    },
    style: { type: null as unknown as PropType<NavItemProps['style']>, default: undefined },
    tabIndex: { type: Number, default: 0 },
    text: { type: null as unknown as PropType<NavigationContent>, default: undefined },
    toggleIcon: {
      type: null as unknown as PropType<NavigationContent>,
      default: undefined,
    },
    tooltipHideDelay: { type: Number, default: undefined },
    tooltipShowDelay: { type: Number, default: undefined },
  },
  emits: {
    click: (data: NavItemSelectedData) => Boolean(data),
    mouseenter: (event: MouseEvent) => Boolean(event),
    mouseleave: (event: MouseEvent) => Boolean(event),
  },
  setup(props, { attrs, emit, slots }) {
    const injectedContext = inject(navigationContextKey);
    if (!injectedContext) throw new Error('please make sure <NavItem> inside <Nav>');
    const context = injectedContext;

    const state: NavItemState = { tooltipShow: false };
    const cache = new Map<unknown, unknown>();
    const foundationProps = (): NavItemProps => props as unknown as NavItemProps;
    const selected = computed(() => context.selectedKeys.value.includes(props.itemKey as ItemKey));
    const isOpen = computed(() => context.openKeys.value.includes(props.itemKey as ItemKey));
    const collapsed = computed(() => props.isCollapsed || context.isCollapsed.value);

    const adapter: NavigationItemAdapter<NavItemProps, NavItemState> = {
      getContext: () => undefined,
      getContexts: () => undefined,
      getProp: (key) => foundationProps()[key],
      getProps: foundationProps,
      getState: (key) => state[key],
      getStates: () => state,
      setState: (nextState, callback) => {
        Object.assign(state, nextState);
        callback?.();
      },
      getCache: (key) => cache.get(key),
      getCaches: () => cache,
      setCache: (key, value) => cache.set(key, value),
      stopPropagation: (event) => event?.stopPropagation?.(),
      persistEvent: () => undefined,
      cloneDeep: clonePayload,
      updateTooltipShow: (show) => {
        state.tooltipShow = show;
      },
      updateSelected: () => {
        if (props.itemKey === undefined) return;
        void nextTick(() => context.setSelectedKeys([props.itemKey as ItemKey]));
      },
      updateGlobalSelectedKeys: (keys) => context.setSelectedKeys([...keys]),
      getSelectedKeys: () => context.selectedKeys.value,
      getSelectedKeysIsControlled: () => context.selectedKeysControlled.value,
      notifyGlobalOnSelect: (data) => {
        context.notifySelect(data as NavigationSelectData);
      },
      notifyGlobalOnClick: (data) => context.notifyClick(data as unknown as NavigationSelectData),
      notifyClick: (data) => emit('click', data as NavItemSelectedData),
      notifyMouseEnter: (event) => emit('mouseenter', event),
      notifyMouseLeave: (event) => emit('mouseleave', event),
      getIsCollapsed: () => collapsed.value,
      getSelected: () => selected.value,
      getIsOpen: () => isOpen.value,
    };
    const foundation = markRaw(new NavigationItemFoundation<NavItemProps, NavItemState>(adapter));
    onMounted(() => foundation.init());
    onBeforeUnmount(() => foundation.destroy());

    const inPopup = computed(
      () => context.isInSubNav && (collapsed.value || context.mode.value === 'horizontal'),
    );
    const shouldTooltip = computed(
      () =>
        (collapsed.value && !context.isInSubNav && !props.isSubNav) ||
        (collapsed.value && props.isSubNav && props.disabled),
    );
    const placeholderCount = computed(() => {
      if (
        context.mode.value !== 'vertical' ||
        context.limitIndent.value ||
        collapsed.value ||
        renderableSlot(slots.default?.())
      ) {
        return 0;
      }
      return Math.max(0, (props.icon && !props.indent ? props.level : props.level - 1) || 0);
    });

    function iconNode(
      content: NavigationContent | undefined,
      position: 'left' | 'right',
      toggle = false,
      key?: string | number,
    ): VNode | null {
      if (props.isSubNav) return null;
      if (!content && context.mode.value === 'horizontal') return null;
      const attributes = {
        class: [
          `${context.prefixCls.value}-item-icon`,
          toggle
            ? `${context.prefixCls.value}-item-icon-toggle-${context.toggleIconPosition.value}`
            : `${context.prefixCls.value}-item-icon-info`,
        ],
        ...(key === undefined ? {} : { key }),
      };
      return h(
        'i',
        attributes,
        content
          ? [
              h(NavigationIconRenderer, {
                content,
                size: position === 'right' ? 'default' : 'large',
              }),
            ]
          : [],
      );
    }

    function itemChildren(): VNodeChild[] {
      const custom = renderableSlot(slots.default?.());
      if (custom) return custom;
      const icon = slots.icon ? () => slots.icon?.() : props.icon;
      const text = slots.text ? () => slots.text?.() : props.text;
      const nodes: VNodeChild[] = [];
      for (let index = 0; index < placeholderCount.value; index += 1) {
        const placeholder = iconNode(undefined, 'right', false, index);
        if (placeholder) nodes.push(placeholder);
      }
      if (context.toggleIconPosition.value === 'left') {
        const toggle = iconNode(props.toggleIcon, 'right', true, 'toggle-left');
        if (toggle) nodes.push(toggle);
      }
      if (icon || props.indent || context.isInSubNav) {
        const information = iconNode(icon, 'left', false, 'information');
        if (information) nodes.push(information);
      }
      if (text !== null && text !== undefined) {
        nodes.push(
          h('span', { class: `${context.prefixCls.value}-item-text` }, [
            h(NavigationNodeRenderer, { content: text }),
          ]),
        );
      }
      if (context.toggleIconPosition.value === 'right') {
        const toggle = iconNode(props.toggleIcon, 'right', true, 'toggle-right');
        if (toggle) nodes.push(toggle);
      }
      return nodes;
    }

    function content(): VNodeChild[] {
      const children = itemChildren();
      if (typeof props.link !== 'string') return children;
      return [
        h(
          'a',
          mergeProps(
            {
              class: `${context.prefixCls.value}-item-link`,
              href: props.link,
              tabindex: -1,
            },
            (props.linkOptions ?? {}) as Record<string, unknown>,
          ),
          children,
        ),
      ];
    }

    function setItemRef(element: unknown): void {
      props.forwardRef?.(element instanceof HTMLLIElement ? element : null);
    }

    function handleClick(event: MouseEvent): void {
      foundation.handleClick(event);
    }

    function handleKey(event: KeyboardEvent): void {
      foundation.handleKeyPress(event);
    }

    function renderItem(): VNode {
      const prefix = `${context.prefixCls.value}-item`;
      const dataAttrs = Object.fromEntries(
        Object.entries(attrs).filter(([name]) => name.startsWith('data-')),
      );
      if (inPopup.value) {
        return h(
          DropdownItem,
          {
            active: selected.value,
            class: [
              prefix,
              props.isSubNav ? `${prefix}-sub` : undefined,
              selected.value ? `${prefix}-selected` : undefined,
              collapsed.value ? `${prefix}-collapsed` : undefined,
              props.disabled ? `${prefix}-disabled` : undefined,
              props.class,
              props.className,
              attrs.class,
            ],
            disabled: props.disabled,
            forwardRef: setItemRef,
            onClick: handleClick,
            onKeydown: handleKey,
            onMouseenter: (event: MouseEvent) => emit('mouseenter', event),
            onMouseleave: (event: MouseEvent) => emit('mouseleave', event),
          },
          { default: content },
        );
      }

      return h(
        'li',
        {
          ...dataAttrs,
          'aria-disabled': props.disabled,
          ...(props.isSubNav ? { 'aria-expanded': isOpen.value } : {}),
          class: [
            props.className || `${prefix}-normal`,
            prefix,
            props.isSubNav ? `${prefix}-sub` : undefined,
            selected.value && !props.isSubNav ? `${prefix}-selected` : undefined,
            collapsed.value ? `${prefix}-collapsed` : undefined,
            props.disabled ? `${prefix}-disabled` : undefined,
            typeof props.link === 'string' ? `${prefix}-has-link` : undefined,
            props.class,
            attrs.class,
          ],
          onClick: handleClick,
          onKeypress: handleKey,
          onMouseenter: (event: MouseEvent) => emit('mouseenter', event),
          onMouseleave: (event: MouseEvent) => emit('mouseleave', event),
          ref: setItemRef,
          role: props.isSubNav ? undefined : 'menuitem',
          style: [props.style, attrs.style],
          tabindex: props.isSubNav ? -1 : props.tabIndex,
        },
        content(),
      );
    }

    return () => {
      let itemElement = renderItem();
      if (shouldTooltip.value) {
        const triggerElement = itemElement;
        itemElement = h(
          Tooltip,
          {
            mouseEnterDelay: props.tooltipShowDelay ?? context.tooltipShowDelay.value,
            mouseLeaveDelay: props.tooltipHideDelay ?? context.tooltipHideDelay.value,
            position: 'right',
            trigger: 'hover',
            wrapWhenSpecial: false,
          },
          {
            content: () =>
              h(NavigationNodeRenderer, {
                content: slots.text ? () => slots.text?.() : props.text,
              }),
            default: () => triggerElement,
          },
        );
      }
      return context.wrapItem({
        isInSubNav: context.isInSubNav,
        isSubNav: props.isSubNav,
        itemElement,
        props: props as NavItemProps | SubNavProps,
      });
    };
  },
});
