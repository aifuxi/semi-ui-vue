<script setup lang="ts">
import {
  Comment,
  Fragment,
  Text,
  computed,
  getCurrentInstance,
  inject,
  isVNode,
  useSlots,
  type VNodeChild,
} from 'vue';

import CollapseButton from './CollapseButton.vue';
import { navigationContextKey } from './navigation-context';
import NavigationNodeRenderer from './NavigationNodeRenderer';
import type { NavFooterEmits, NavFooterProps, NavFooterSlots } from './types';

defineOptions({ name: 'NavFooter', inheritAttrs: false });
const props = defineProps<NavFooterProps>();
const emit = defineEmits<NavFooterEmits>();
defineSlots<NavFooterSlots>();
const slots = useSlots();
const instance = getCurrentInstance();
const context = inject(navigationContextKey);
if (!context) throw new Error('please make sure <NavFooter> inside <Nav>');

function hasRawProp(name: string): boolean {
  const raw = instance?.vnode.props;
  const kebab = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, name) ||
      Object.prototype.hasOwnProperty.call(raw, kebab)),
  );
}

function hasElement(nodes: VNodeChild): boolean {
  if (Array.isArray(nodes)) return nodes.some(hasElement);
  if (!isVNode(nodes) || nodes.type === Comment || nodes.type === Text) return false;
  if (nodes.type === Fragment) return hasElement(nodes.children as VNodeChild);
  return true;
}

const defaultNodes = computed(() => slots.default?.() ?? []);
const customCollapse = computed(() => slots.collapseButton?.() ?? props.collapseButton);
const collapseEnabled = computed(() => {
  if (slots.collapseButton) return true;
  if (!hasRawProp('collapseButton')) return false;
  return props.collapseButton !== false;
});
const renderBuiltInCollapse = computed(
  () =>
    collapseEnabled.value &&
    !hasElement(defaultNodes.value) &&
    context.mode.value !== 'horizontal' &&
    !isVNode(customCollapse.value),
);
const classes = computed(() => [
  props.class,
  props.className,
  'semi-navigation-footer',
  context.isCollapsed.value ? 'semi-navigation-footer-collapsed' : undefined,
]);
const collapseButtonBindings = computed(() => ({
  ...(props.collapseText ? { collapseText: props.collapseText } : {}),
  isCollapsed: context.isCollapsed.value,
  locale: context.locale.value,
  prefixCls: context.prefixCls.value,
}));
</script>

<template>
  <div :class="classes" :style="props.style" @click="emit('click', $event)">
    <CollapseButton
      v-if="renderBuiltInCollapse"
      v-bind="collapseButtonBindings"
      @click="context.toggleCollapsed"
    />
    <NavigationNodeRenderer
      v-else-if="
        collapseEnabled && !hasElement(defaultNodes) && context.mode.value !== 'horizontal'
      "
      :content="customCollapse"
    />
    <slot v-else />
  </div>
</template>
