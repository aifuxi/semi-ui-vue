<script setup lang="ts">
import { computed, provide, shallowRef, useAttrs, useSlots, type VNode } from 'vue';

import LayoutSider from './LayoutSider.vue';
import { layoutSiderHookKey } from './layout-context';
import type { LayoutProps, LayoutSlots } from './types';

defineOptions({
  name: 'Layout',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<LayoutProps>(), {
  prefixCls: 'semi-layout',
  tagName: 'section',
});
defineSlots<LayoutSlots>();

const attrs = useAttrs();
const slots = useSlots();
const siderIds = shallowRef<readonly string[]>([]);

provide(layoutSiderHookKey, {
  addSider(id) {
    if (siderIds.value.includes(id)) return;
    siderIds.value = [...siderIds.value, id];
  },
  removeSider(id) {
    siderIds.value = siderIds.value.filter((currentId) => currentId !== id);
  },
});

function isDirectSider(vnode: VNode): boolean {
  return vnode.type === LayoutSider;
}

const hasDirectSider = computed(() => (slots.default?.() ?? []).some(isDirectSider));
const layoutClasses = computed(() => [
  props.prefixCls,
  {
    [`${props.prefixCls}-has-sider`]:
      props.hasSider === true || siderIds.value.length > 0 || hasDirectSider.value,
  },
  attrs.class,
]);
const rootAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([attributeName]) => attributeName !== 'class')),
);
</script>

<template>
  <component :is="props.tagName" v-bind="rootAttrs" :class="layoutClasses">
    <slot />
  </component>
</template>
