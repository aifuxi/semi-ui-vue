<script setup lang="ts">
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
import { shallowRef } from 'vue';
const data = [
  '围城',
  '平凡的世界（全三册）',
  '三体（全集）',
  '雪中悍刀行（全集）',
  '撒哈拉的故事',
  '明朝那些事',
  '一禅小和尚',
  '沙丘',
  '被讨厌的勇气',
  '罪与罚',
];
const active = shallowRef(-1);
function onKeydown(event: KeyboardEvent) {
  if (!['ArrowUp', 'ArrowDown'].includes(event.key)) return;
  event.preventDefault();
  active.value =
    event.key === 'ArrowDown'
      ? (active.value + 1) % data.length
      : active.value <= 0
        ? data.length - 1
        : active.value - 1;
}
</script>

<template>
  <div
    class="book-list"
    style="width: 280px; display: flex; flex-wrap: wrap; margin-right: 16px"
    tabindex="0"
    role="group"
    aria-label="书籍列表，使用上下方向键浏览"
    @keydown="onKeydown"
  >
    <List
      :data-source="data"
      :split="false"
      size="small"
      style="flex-basis: 100%; flex-shrink: 0; border: 1px solid var(--semi-color-border)"
      ><template #item="{ item, index }"
        ><ListItem :class="index === active ? 'active-item' : ''">{{ item }}</ListItem></template
      ></List
    >
  </div>
</template>

<style scoped>
.book-list :deep(.list-item:hover),
.book-list :deep(.active-item) {
  background-color: var(--semi-color-fill-0);
}
.book-list :deep(.list-item:active) {
  background-color: var(--semi-color-fill-1);
}
</style>
