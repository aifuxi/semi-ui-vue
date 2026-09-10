<script setup lang="ts">
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';
import '@aifuxi/semi-theme-default/pagination.css';
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
  '月亮与六便士',
  '沉默的大多数',
];
const page = shallowRef(1);
const pageData = computed(() => data.slice((page.value - 1) * 4, page.value * 4));
</script>

<template>
  <div class="book-list" style="width: 280px; display: flex; flex-wrap: wrap; margin-right: 16px">
    <List
      :data-source="pageData"
      :split="false"
      size="small"
      style="flex-basis: 100%; flex-shrink: 0; border: 1px solid var(--semi-color-border)"
      ><template #item="{ item }"
        ><ListItem class="list-item">{{ item }}</ListItem></template
      ></List
    ><Pagination
      v-model:current-page="page"
      size="small"
      :total="data.length"
      :page-size="4"
      style="width: 100%; flex-basis: 100%; justify-content: center"
    />
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
