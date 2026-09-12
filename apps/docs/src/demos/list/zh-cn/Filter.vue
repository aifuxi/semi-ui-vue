<script setup lang="ts">
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
import { Input } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
import { IconSearch } from '@aifuxi/semi-icons-vue';
import { computed, shallowRef } from 'vue';
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
const query = shallowRef('');
const filtered = computed(() => data.filter((item) => item.includes(String(query.value))));
</script>

<template>
  <div
    class="book-list"
    style="
      width: 280px;
      display: flex;
      flex-wrap: wrap;
      margin-right: 16px;
      border: 1px solid var(--semi-color-border);
    "
  >
    <List
      class="component-list-demo-booklist"
      :data-source="filtered"
      :split="false"
      size="small"
      style="flex-basis: 100%; flex-shrink: 0; border-bottom: 1px solid var(--semi-color-border)"
      ><template #header
        ><Input v-model="query" placeholder="搜索"
          ><template #prefix><IconSearch /></template></Input></template
      ><template #item="{ item }"
        ><ListItem class="list-item">{{ item }}</ListItem></template
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
