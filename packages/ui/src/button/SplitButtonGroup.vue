<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useAttrs, useTemplateRef } from 'vue';

import type { SplitButtonGroupProps } from './types';

defineOptions({
  name: 'SplitButtonGroup',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<SplitButtonGroupProps>(), {
  prefixCls: 'semi-button',
});
const attrs = useAttrs();
const ariaLabel = computed(() =>
  typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : undefined,
);
const container = useTemplateRef<HTMLDivElement>('container');
let observer: MutationObserver | null = null;

function markBoundaryButtons(): void {
  const buttons = container.value?.querySelectorAll('button');
  const firstButton = buttons?.[0];
  const lastButton = buttons?.[buttons.length - 1];
  if (!firstButton?.classList.contains(`${props.prefixCls}-first`)) {
    firstButton?.classList.add(`${props.prefixCls}-first`);
  }
  if (!lastButton?.classList.contains(`${props.prefixCls}-last`)) {
    lastButton?.classList.add(`${props.prefixCls}-last`);
  }
}

onMounted(() => {
  if (!container.value) return;
  markBoundaryButtons();
  observer = new MutationObserver((mutations) => {
    const shouldRefresh = mutations.some(
      (mutation) =>
        (mutation.type === 'attributes' && mutation.attributeName === 'class') ||
        (mutation.type === 'childList' &&
          Array.from(mutation.addedNodes).some((node) => node.nodeName === 'BUTTON')),
    );
    if (shouldRefresh) markBoundaryButtons();
  });
  observer.observe(container.value, { attributes: true, childList: true, subtree: true });
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});
</script>

<template>
  <div
    ref="container"
    :class="[`${props.prefixCls}-split`, attrs.class]"
    :style="attrs.style"
    role="group"
    :aria-label="ariaLabel"
  >
    <slot />
  </div>
</template>
