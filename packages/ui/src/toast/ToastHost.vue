<script setup lang="ts">
import { computed, onMounted, useTemplateRef, watch } from 'vue';

import ToastNotice from './ToastNotice.vue';
import { ToastStore } from './toast-store';
import type { ToastEntry } from './types';

defineOptions({ name: 'ToastHost' });
const props = defineProps<{ store: ToastStore }>();
const innerWrapper = useTemplateRef<HTMLElement>('innerWrapper');

const entries = computed<ToastEntry[]>(() => {
  const combined = [...props.store.state.list, ...props.store.state.removedItems];
  return combined.filter(
    (entry, index) => combined.findIndex((candidate) => candidate.id === entry.id) === index,
  );
});

function animationClass(entry: ToastEntry): string | undefined {
  if (!props.store.animated || !entry.motion || entry.phase === 'stable') return undefined;
  return `semi-toast-animation-${entry.phase === 'leave' ? 'hide' : 'show'}`;
}

function handleAnimationEnd(entry: ToastEntry): void {
  if (entry.phase === 'leave') props.store.finishRemove(entry.id);
  else props.store.finishEnter(entry.id);
}

function handleRemove(id: string): void {
  props.store.remove(id);
}

function handleMouseEnter(): void {
  if (props.store.stack) props.store.setMouseInside(true);
}

function handleMouseLeave(): void {
  if (props.store.stack && props.store.getInnerWrapperRect()?.height) {
    props.store.setMouseInside(false);
  }
}

watch(
  innerWrapper,
  (element) => {
    props.store.setInnerWrapper(element ?? undefined);
  },
  { flush: 'post' },
);
onMounted(() => {
  props.store.setInnerWrapper(innerWrapper.value ?? undefined);
});
</script>

<template>
  <div
    ref="innerWrapper"
    :class="[
      'semi-toast-innerWrapper',
      props.store.state.mouseInSide ? 'semi-toast-innerWrapper-hover' : undefined,
    ]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <ToastNotice
      v-for="(entry, index) in entries"
      :key="entry.id"
      :animation-class="animationClass(entry)"
      :entry="entry"
      :position-in-list="{ length: entries.length, index }"
      :stack="props.store.stack"
      :stack-expanded="props.store.state.mouseInSide"
      @animation-end="handleAnimationEnd(entry)"
      @remove="handleRemove"
    />
  </div>
</template>
