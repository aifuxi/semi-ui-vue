<script setup lang="ts">
import { ref } from 'vue';
import { ScrollItem, ScrollList, type ScrollItemSelectData } from '@aifuxi/semi-ui-vue/scroll-list';

const selectedIndex = ref(1);
const hours = Array.from({ length: 12 }, (_, index) => ({
  value: index + 1,
  disabled: index === 5,
}));

function select(data: ScrollItemSelectData): void {
  selectedIndex.value = data.index;
}
import '@aifuxi/semi-theme-default/scroll-list.css';
</script>

<template>
  <ScrollList :body-height="240">
    <template #header>Select an hour</template>
    <ScrollItem
      aria-label="Hour"
      cycled
      :list="hours"
      mode="wheel"
      :selected-index="selectedIndex"
      type="hour"
      @select="select"
    />
    <template #footer>Scroll or click an option</template>
  </ScrollList>
</template>
