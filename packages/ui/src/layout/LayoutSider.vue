<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, useAttrs } from 'vue';

import { layoutSiderHookKey } from './layout-context';
import { generateLayoutSiderId, registerLayoutMediaQuery } from './media-query';
import {
  LAYOUT_BREAKPOINTS,
  LAYOUT_RESPONSIVE_MAP,
  type LayoutSiderEmits,
  type LayoutSiderProps,
  type LayoutSlots,
} from './types';

defineOptions({
  name: 'LayoutSider',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<LayoutSiderProps>(), {
  prefixCls: 'semi-layout',
  breakpoint: () => [],
});
const emit = defineEmits<LayoutSiderEmits>();
defineSlots<LayoutSlots>();

const attrs = useAttrs();
const siderHook = inject(layoutSiderHookKey, null);
const uniqueId = generateLayoutSiderId();
const unRegisters: Array<() => void> = [];

const siderClasses = computed(() => [`${props.prefixCls}-sider`, attrs.class]);
const siderAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([attributeName]) => attributeName === 'style' || attributeName.startsWith('data-'),
    ),
  ),
);
const ariaLabel = computed(() => attrs['aria-label'] as string | undefined);

onMounted(() => {
  for (const screen of LAYOUT_BREAKPOINTS) {
    if (!props.breakpoint.includes(screen)) continue;
    unRegisters.push(
      registerLayoutMediaQuery(screen, LAYOUT_RESPONSIVE_MAP[screen], (matchedScreen, matches) => {
        emit('breakpoint', matchedScreen, matches);
      }),
    );
  }
  siderHook?.addSider(uniqueId);
});

onBeforeUnmount(() => {
  for (const unRegister of unRegisters) unRegister();
  siderHook?.removeSider(uniqueId);
});
</script>

<template>
  <aside v-bind="siderAttrs" :aria-label="ariaLabel" :class="siderClasses">
    <div :class="`${props.prefixCls}-sider-children`">
      <slot />
    </div>
  </aside>
</template>
