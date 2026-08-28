<script setup lang="ts">
import { computed, inject, onBeforeUnmount, shallowRef, useAttrs, watch } from 'vue';

import TabsNodeRenderer from './TabsNodeRenderer';
import { tabsContextKey } from './tabs-context';
import type { TabPaneProps, TabPaneSlots } from './types';

defineOptions({ name: 'TabPane', inheritAttrs: false });
const props = withDefaults(defineProps<TabPaneProps>(), { tabIndex: 0 });
defineSlots<TabPaneSlots>();
const attrs = useAttrs();
const context = inject(tabsContextKey, undefined);
const standaloneActive = computed(() => true);
const active = computed(
  () => context?.activeKey.value === props.itemKey || (standaloneActive.value && !context),
);
const visited = shallowRef(active.value);
const animationClass = shallowRef('');
let animationTimer: ReturnType<typeof setTimeout> | undefined;

const paneClasses = computed(() => [
  'semi-tabs-pane',
  active.value ? 'semi-tabs-pane-active' : 'semi-tabs-pane-inactive',
  props.class,
  props.className,
  attrs.class,
]);
const shouldRender = computed(() => !context?.lazyRender.value || visited.value);
const forwardedAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([name]) => name !== 'class' && name !== 'style' && name.startsWith('data-'),
    ),
  ),
);

function directionClass(): string {
  if (!context) return '';
  const activeIndex = context.panes.value.findIndex(
    (pane) => pane.itemKey === context.activeKey.value,
  );
  const itemIndex = context.panes.value.findIndex((pane) => pane.itemKey === props.itemKey);
  const previousIndex = context.panes.value.findIndex(
    (pane) => pane.itemKey === context.prevActiveKey.value,
  );
  const backwards =
    activeIndex === itemIndex ? previousIndex > activeIndex : itemIndex < activeIndex;
  if (context.tabPosition.value === 'left') {
    return backwards ? 'semi-tabs-pane-animate-bottomShow' : 'semi-tabs-pane-animate-topShow';
  }
  return backwards ? 'semi-tabs-pane-animate-rightShow' : 'semi-tabs-pane-animate-leftShow';
}

watch(
  active,
  (value, previous) => {
    if (value) visited.value = true;
    if (
      value &&
      previous === false &&
      context?.tabPaneMotion.value &&
      !context.forceDisableMotion.value &&
      typeof window !== 'undefined'
    ) {
      animationClass.value = directionClass();
      if (animationTimer) clearTimeout(animationTimer);
      animationTimer = setTimeout(() => {
        animationClass.value = '';
      }, 200);
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (animationTimer) clearTimeout(animationTimer);
});
</script>

<template>
  <div
    v-bind="forwardedAttrs"
    :id="`semiTabPanel${itemKey}`"
    :aria-hidden="active ? 'false' : 'true'"
    :aria-labelledby="`semiTab${itemKey}`"
    :class="paneClasses"
    role="tabpanel"
    :style="[style, attrs.style]"
    :tabindex="tabIndex || 0"
    x-semi-prop="children"
  >
    <div :class="['semi-tabs-pane-motion-overlay', animationClass]" x-semi-prop="children">
      <TabsNodeRenderer v-if="shouldRender" :content="$slots.default?.()" />
    </div>
  </div>
</template>
