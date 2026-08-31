<script setup lang="ts">
import { IconChevronRightStroked } from '@aifuxi/semi-icons-vue';
import { nextTick, onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch } from 'vue';

const props = defineProps<{ itemCount?: number }>();
const container = useTemplateRef<HTMLDivElement>('container');
const canScrollLeft = shallowRef(false);
const canScrollRight = shallowRef(false);
let observer: ResizeObserver | undefined;

function check(): void {
  const element = container.value;
  if (!element) return;
  const normalizedLeft = Math.abs(element.scrollLeft);
  canScrollLeft.value = normalizedLeft > 1;
  canScrollRight.value = Math.ceil(normalizedLeft) < element.scrollWidth - element.clientWidth;
}

function scroll(amount: number): void {
  container.value?.scrollBy({ left: amount, behavior: 'smooth' });
}

onMounted(() => {
  check();
  if (typeof ResizeObserver !== 'undefined' && container.value) {
    observer = new ResizeObserver(check);
    observer.observe(container.value);
  }
  container.value?.addEventListener('scroll', check);
});
onBeforeUnmount(() => {
  observer?.disconnect();
  container.value?.removeEventListener('scroll', check);
});
watch(
  () => props.itemCount,
  () => void nextTick(check),
);
</script>

<template>
  <div class="semi-aiChatInput-scroll-wrapper">
    <button
      v-if="canScrollLeft"
      class="semi-aiChatInput-scroll-button semi-aiChatInput-scroll-button-left"
      aria-label="Scroll left"
      @click="scroll(-300)"
    >
      <IconChevronRightStroked class="semi-aiChatInput-scroll-button-left-icon" />
    </button>
    <div ref="container" class="semi-aiChatInput-scroll-container"><slot /></div>
    <button
      v-if="canScrollRight"
      class="semi-aiChatInput-scroll-button semi-aiChatInput-scroll-button-right"
      aria-label="Scroll right"
      @click="scroll(300)"
    >
      <IconChevronRightStroked />
    </button>
  </div>
</template>
