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
  // 固定上游按当前长度取下一项（删除后再新增会追加一条重复书名）；保持同一行为才能与参考侧一致。
  items.value = items.value.concat(catalog.slice(items.value.length, items.value.length + 1));
}
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
      :data-source="items"
      :split="false"
      size="small"
      style="flex-basis: 100%; flex-shrink: 0; border-bottom: 1px solid var(--semi-color-border)"
      ><template #item="{ item }"
        ><div style="margin: 4px" class="list-item">
          <Button theme="borderless" type="danger" style="margin-right: 4px" @click="remove(item)"
            ><template #icon><IconMinusCircle /></template></Button
          >{{ item }}
        </div></template
      ></List
    >
    <div style="margin: 4px; font-size: 14px" @click="add">
      <Button theme="borderless" style="margin-right: 4px; color: var(--semi-color-info)"
        ><template #icon><IconPlusCircle /></template></Button
      >新增书籍
    </div>
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
