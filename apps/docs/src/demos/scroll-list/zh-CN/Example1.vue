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
    <template #header>选择小时</template>
    <ScrollItem
      aria-label="小时"
      cycled
      :list="hours"
      mode="wheel"
      :selected-index="selectedIndex"
      type="hour"
      @select="select"
    />
    <template #footer>滚动或点击选项</template>
  </ScrollList>
</template>
