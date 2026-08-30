<script setup lang="ts">
import {
  NavigationSubNavFoundation,
  type NavigationSubNavAdapter,
} from '@workspace/foundation-integration';
import { IconChevronDown, IconChevronRight } from '@aifuxi/semi-icons-vue';
import {
  computed,
  h,
  inject,
  markRaw,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  useSlots,
  useTemplateRef,
} from 'vue';

import Collapsible from '../collapsible/Collapsible.vue';
import { Dropdown, DropdownMenu } from '../dropdown';
import NavItem from './NavItem';
import NavigationContextProvider from './NavigationContextProvider';
import NavigationIconRenderer from './NavigationIconRenderer';
import NavigationNodeRenderer from './NavigationNodeRenderer';
import { navigationContextKey } from './navigation-context';
import type {
  ItemKey,
  NavigationContent,
  NavigationOpenChangeData,
  SubNavProps,
  SubNavSlots,
} from './types';

defineOptions({ name: 'SubNav', inheritAttrs: false });
const props = withDefaults(defineProps<SubNavProps>(), {
  disabled: false,
  indent: false,
  isCollapsed: false,
  isOpen: false,
  level: 0,
  maxHeight: 999,
});
defineSlots<SubNavSlots>();
const slots = useSlots();
const context = inject(navigationContextKey);
if (!context) throw new Error('please make sure <SubNav> inside <Nav>');
const nestedContext = { ...context, isInSubNav: true };
const titleRef = useTemplateRef<HTMLDivElement>('title');

interface SubNavState {
  isHovered: boolean;
}
const state = shallowReactive<SubNavState>({ isHovered: false });
const cache = new Map<unknown, unknown>();
const isOpen = computed(() => context.openKeys.value.includes(props.itemKey as ItemKey));
const collapsed = computed(() => props.isCollapsed || context.isCollapsed.value);

function foundationProps(): SubNavProps {
  return props as unknown as SubNavProps;
}

const adapter: NavigationSubNavAdapter<SubNavProps, SubNavState> = {
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
  updateIsHovered: (hovered) => {
    state.isHovered = hovered;
  },
  getOpenKeys: () => context.openKeys.value,
  getOpenKeysIsControlled: () => context.openKeysControlled.value,
  getCanUpdateOpenKeys: () => true,
  updateOpen: (open) => {
    if (props.itemKey === undefined) return;
    if (open) context.addOpenKey(props.itemKey);
    else context.removeOpenKey(props.itemKey);
  },
  notifyGlobalOpenChange: (data) =>
    context.notifyOpenChange(data as unknown as NavigationOpenChangeData),
  notifyGlobalOnSelect: () => undefined,
  notifyGlobalOnClick: (data) => context.notifyClick(data),
  getIsSelected: (key) => context.selectedKeys.value.includes(key),
  getIsOpen: () => isOpen.value,
};
const foundation = markRaw(new NavigationSubNavFoundation<SubNavProps, SubNavState>(adapter));
onMounted(() => foundation.init());
onBeforeUnmount(() => foundation.destroy());

const titleClasses = computed(() => [
  `${context.prefixCls.value}-sub-title`,
  props.itemKey !== undefined && context.selectedKeys.value.includes(props.itemKey)
    ? `${context.prefixCls.value}-sub-title-selected`
    : undefined,
  props.disabled ? `${context.prefixCls.value}-sub-title-disabled` : undefined,
]);
const subClasses = computed(() => [
  `${context.prefixCls.value}-sub`,
  isOpen.value ? `${context.prefixCls.value}-sub-open` : undefined,
  collapsed.value || context.mode.value === 'horizontal'
    ? `${context.prefixCls.value}-sub-popover`
    : undefined,
]);
const showNestedChevron = computed(
  () =>
    (!collapsed.value && context.isInSubNav && context.mode.value === 'horizontal') ||
    (collapsed.value && context.isInSubNav),
);
const toggleIcon = computed<NavigationContent | undefined>(() => {
  if (collapsed.value) return context.isInSubNav ? () => h(IconChevronRight) : undefined;
  if (context.mode.value === 'horizontal' && context.isInSubNav) {
    return () => h(IconChevronRight);
  }
  return slots.expandIcon
    ? () => slots.expandIcon?.()
    : (props.expandIcon ?? context.expandIcon.value ?? (() => h(IconChevronDown)));
});
const hasToggleIcon = computed(() => toggleIcon.value !== undefined && toggleIcon.value !== null);
const hasCustomToggleIcon = computed(() =>
  Boolean(slots.expandIcon || props.expandIcon || context.expandIcon.value),
);
const defaultToggleIcon = computed(() =>
  context.isInSubNav && (collapsed.value || context.mode.value === 'horizontal')
    ? IconChevronRight
    : IconChevronDown,
);
const informationIcon = computed<NavigationContent | undefined>(() =>
  slots.icon ? () => slots.icon?.() : props.icon,
);
const titleContent = computed<NavigationContent | undefined>(() =>
  slots.text ? () => slots.text?.() : props.text,
);
const placeholderCount = computed(() => {
  if (context.mode.value !== 'vertical' || context.limitIndent.value || collapsed.value) {
    return 0;
  }
  return Math.max(0, (props.icon && !props.indent ? props.level : props.level - 1) || 0);
});
const iconRotation = computed(() =>
  context.subNavMotion.value
    ? `${context.prefixCls.value}-icon-rotate-${isOpen.value ? '180' : '0'}`
    : undefined,
);

function handleClick(event: MouseEvent): void {
  foundation.handleClick(event, titleRef.value);
}

function handleKey(event: KeyboardEvent): void {
  foundation.handleKeyPress(event, titleRef.value);
}

function handleDropdownVisible(visible: boolean): void {
  foundation.handleDropdownVisibleChange(visible);
}

const dropdownBindings = computed(() => {
  const inherited = (props.dropdownProps ?? context.subDropdownProps.value ?? {}) as Record<
    string,
    unknown
  >;
  const userVisibleChange = inherited.onVisibleChange;
  const bindings: Record<string, unknown> = {
    ...inherited,
    class: [collapsed.value ? `${context.prefixCls.value}-popover` : undefined, inherited.class],
    getPopupContainer: context.getPopupContainer.value,
    mouseEnterDelay: context.subNavOpenDelay.value,
    mouseLeaveDelay: context.subNavCloseDelay.value,
    onVisibleChange: (visible: boolean) => {
      if (typeof userVisibleChange === 'function') {
        (userVisibleChange as (nextVisible: boolean) => void)(visible);
      } else {
        handleDropdownVisible(visible);
      }
    },
    position:
      context.mode.value === 'horizontal' && !context.isInSubNav ? 'bottomLeft' : 'rightTop',
    style: props.dropdownStyle,
    trigger: context.openKeysControlled.value ? 'custom' : 'hover',
  };
  if (context.openKeysControlled.value) bindings.visible = isOpen.value;
  if (!context.getPopupContainer.value) delete bindings.getPopupContainer;
  return bindings;
});
</script>

<template>
  <NavItem
    :class-name="`${context.prefixCls.value}-sub-wrap`"
    :disabled="props.disabled"
    :is-collapsed="collapsed"
    is-sub-nav
    :item-key="props.itemKey"
    :style="props.style"
  >
    <NavigationContextProvider :value="nestedContext">
      <Dropdown v-if="collapsed || context.mode.value === 'horizontal'" v-bind="dropdownBindings">
        <div
          ref="title"
          role="menuitem"
          :tabindex="showNestedChevron ? -1 : 0"
          :class="titleClasses"
          :aria-expanded="isOpen ? 'true' : 'false'"
          @click="handleClick"
          @keypress="handleKey"
        >
          <div :class="`${context.prefixCls.value}-item-inner`">
            <i
              v-for="index in placeholderCount"
              :key="`placeholder-${index}`"
              :class="[
                `${context.prefixCls.value}-item-icon`,
                `${context.prefixCls.value}-item-icon-info`,
              ]"
            />
            <i
              v-if="context.toggleIconPosition.value === 'left' && hasToggleIcon"
              :class="[
                `${context.prefixCls.value}-item-icon`,
                `${context.prefixCls.value}-item-icon-toggle-${context.toggleIconPosition.value}`,
              ]"
            >
              <component
                :is="defaultToggleIcon"
                v-if="!hasCustomToggleIcon"
                :class="iconRotation"
                size="default"
              />
              <NavigationIconRenderer
                v-else
                :animation-class="iconRotation || ''"
                :content="toggleIcon"
                force
                size="default"
              />
            </i>
            <i
              v-if="
                informationIcon ||
                props.indent ||
                (context.isInSubNav && context.mode.value !== 'horizontal')
              "
              :class="[
                `${context.prefixCls.value}-item-icon`,
                `${context.prefixCls.value}-item-icon-info`,
              ]"
            >
              <NavigationIconRenderer :content="informationIcon" force size="large" />
            </i>
            <span :class="`${context.prefixCls.value}-item-text`">
              <NavigationNodeRenderer :content="titleContent" />
            </span>
            <i
              v-if="context.toggleIconPosition.value === 'right' && hasToggleIcon"
              :class="[
                `${context.prefixCls.value}-item-icon`,
                `${context.prefixCls.value}-item-icon-toggle-${context.toggleIconPosition.value}`,
              ]"
            >
              <component
                :is="defaultToggleIcon"
                v-if="!hasCustomToggleIcon"
                :class="iconRotation"
                size="default"
              />
              <NavigationIconRenderer
                v-else
                :animation-class="iconRotation || ''"
                :content="toggleIcon"
                force
                size="default"
              />
            </i>
          </div>
        </div>
        <template #content>
          <DropdownMenu><slot /></DropdownMenu>
        </template>
      </Dropdown>
      <template v-else>
        <div
          ref="title"
          role="menuitem"
          tabindex="0"
          :class="titleClasses"
          :aria-expanded="isOpen ? 'true' : 'false'"
          @click="handleClick"
          @keypress="handleKey"
        >
          <div :class="`${context.prefixCls.value}-item-inner`">
            <i
              v-for="index in placeholderCount"
              :key="`placeholder-${index}`"
              :class="[
                `${context.prefixCls.value}-item-icon`,
                `${context.prefixCls.value}-item-icon-info`,
              ]"
            />
            <i
              v-if="context.toggleIconPosition.value === 'left' && hasToggleIcon"
              :class="[
                `${context.prefixCls.value}-item-icon`,
                `${context.prefixCls.value}-item-icon-toggle-${context.toggleIconPosition.value}`,
              ]"
            >
              <component
                :is="defaultToggleIcon"
                v-if="!hasCustomToggleIcon"
                :class="iconRotation"
                size="default"
              />
              <NavigationIconRenderer
                v-else
                :animation-class="iconRotation || ''"
                :content="toggleIcon"
                force
                size="default"
              />
            </i>
            <i
              v-if="informationIcon || props.indent || context.isInSubNav"
              :class="[
                `${context.prefixCls.value}-item-icon`,
                `${context.prefixCls.value}-item-icon-info`,
              ]"
            >
              <NavigationIconRenderer :content="informationIcon" force size="large" />
            </i>
            <span :class="`${context.prefixCls.value}-item-text`">
              <NavigationNodeRenderer :content="titleContent" />
            </span>
            <i
              v-if="context.toggleIconPosition.value === 'right' && hasToggleIcon"
              :class="[
                `${context.prefixCls.value}-item-icon`,
                `${context.prefixCls.value}-item-icon-toggle-${context.toggleIconPosition.value}`,
              ]"
            >
              <component
                :is="defaultToggleIcon"
                v-if="!hasCustomToggleIcon"
                :class="iconRotation"
                size="default"
              />
              <NavigationIconRenderer
                v-else
                :animation-class="iconRotation || ''"
                :content="toggleIcon"
                force
                size="default"
              />
            </i>
          </div>
        </div>
        <Collapsible
          v-if="context.subNavMotion.value"
          :fade="true"
          :is-open="isOpen"
          :keep-d-o-m="false"
          :motion="context.subNavMotion.value"
        >
          <ul :class="subClasses">
            <slot />
          </ul>
        </Collapsible>
        <ul v-else-if="isOpen" :class="subClasses">
          <slot />
        </ul>
      </template>
    </NavigationContextProvider>
  </NavItem>
</template>
