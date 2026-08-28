<script setup lang="ts">
import { computed, shallowRef } from 'vue';

const props = defineProps<{
  direction: 'ltr' | 'rtl';
  pages: number[];
}>();
const emit = defineEmits<{ select: [page: number] }>();

const ITEM_HEIGHT = 32;
const VIEWPORT_COUNT = 5;
const scrollTop = shallowRef(0);
const viewportHeight = computed(() => Math.min(props.pages.length, VIEWPORT_COUNT) * ITEM_HEIGHT);
const start = computed(() => Math.max(0, Math.floor(scrollTop.value / ITEM_HEIGHT) - 1));
const end = computed(() => Math.min(props.pages.length, start.value + VIEWPORT_COUNT + 2));
const visiblePages = computed(() =>
  props.pages.slice(start.value, end.value).map((page, offset) => ({
    index: start.value + offset,
    page,
  })),
);

function handleScroll(event: Event): void {
  scrollTop.value = (event.currentTarget as HTMLElement).scrollTop;
}
</script>

<template>
  <div
    class="semi-page-rest-list"
    :style="{
      direction: props.direction,
      height: `${viewportHeight}px`,
      overflowY: props.pages.length > VIEWPORT_COUNT ? 'auto' : 'hidden',
      width: '78px',
    }"
    @scroll="handleScroll"
  >
    <div
      :style="{
        height: `${props.pages.length * ITEM_HEIGHT}px`,
        maxHeight: `${props.pages.length * ITEM_HEIGHT}px`,
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
      }"
    >
      <div
        v-for="item in visiblePages"
        :key="item.page"
        role="listitem"
        :aria-label="String(item.page)"
        class="semi-page-rest-item"
        :style="{
          height: `${ITEM_HEIGHT}px`,
          left: 0,
          position: 'absolute',
          top: `${item.index * ITEM_HEIGHT}px`,
          width: '100%',
        }"
        @click="emit('select', item.page)"
      >
        {{ item.page }}
      </div>
    </div>
  </div>
</template>
