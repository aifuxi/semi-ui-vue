<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { List } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
import { IconMinusCircle, IconPlusCircle } from '@aifuxi/semi-icons-vue';
import { shallowRef } from 'vue';
const catalog = [
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
  '第一人称单数',
];
const items = shallowRef(catalog.slice(0, 8));
function remove(item: string) {
  items.value = items.value.filter((book) => book !== item);
}
function add() {
  const next = catalog.find((book) => !items.value.includes(book));
  if (next) items.value = [...items.value, next];
}
</script>

<template>
  <div class="book-list" style="width: 280px; display: flex; flex-wrap: wrap; margin-right: 16px">
    <List
      :data-source="items"
      :split="false"
      size="small"
      style="flex-basis: 100%; flex-shrink: 0; border: 1px solid var(--semi-color-border)"
      ><template #item="{ item }"
        ><div style="margin: 4px" class="list-item">
          <Button
            theme="borderless"
            type="danger"
            style="margin-right: 4px"
            :aria-label="'删除 ' + item"
            @click="remove(item)"
            ><template #icon><IconMinusCircle /></template></Button
          >{{ item }}
        </div></template
      ><template #footer
        ><Button theme="borderless" :disabled="items.length === catalog.length" @click="add"
          ><template #icon><IconPlusCircle /></template>新增书籍</Button
        ></template
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
