<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, useTemplateRef } from 'vue';

const props = defineProps<{ initiallyOpen: boolean }>();
const emit = defineEmits<{ end: [] }>();
const contentRef = useTemplateRef<HTMLElement>('content');
const open = shallowRef(props.initiallyOpen);
const transitioning = shallowRef(false);
const contentHeight = shallowRef(0);
let startTimer: ReturnType<typeof setTimeout> | undefined;

const wrapperStyle = computed(() => ({
  height: `${open.value ? contentHeight.value : 0}px`,
  opacity: open.value ? 1 : 0,
  overflow: 'hidden',
  transitionDuration: `${transitioning.value ? 200 : 0}ms`,
}));

onMounted(async () => {
  await nextTick();
  contentHeight.value = contentRef.value?.scrollHeight ?? 0;
  startTimer = setTimeout(() => {
    transitioning.value = true;
    open.value = !props.initiallyOpen;
  }, 0);
});

onBeforeUnmount(() => {
  if (startTimer !== undefined) clearTimeout(startTimer);
});

function handleTransitionEnd(event: TransitionEvent): void {
  if (event.target !== event.currentTarget) return;
  transitioning.value = false;
  emit('end');
}
</script>

<template>
  <div
    :class="['semi-collapsible-wrapper', transitioning ? 'semi-collapsible-transition' : undefined]"
    :style="wrapperStyle"
    @transitionend="handleTransitionEnd"
  >
    <div ref="content" style="overflow: hidden" x-semi-prop="children"><slot /></div>
  </div>
</template>
