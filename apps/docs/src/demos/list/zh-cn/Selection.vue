<script setup lang="ts">
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
import { Checkbox, CheckboxGroup } from '@aifuxi/semi-ui-vue/checkbox';
import '@aifuxi/semi-theme-default/checkbox.css';
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/radio.css';
import { shallowRef } from 'vue';
import type { RadioValue } from '@aifuxi/semi-ui-vue/radio';
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
  '第一人称单数',
];
const items = data.slice(0, 8);
const checked = shallowRef<unknown[]>(data[0] ? [data[0]] : []);
const selected = shallowRef<RadioValue | undefined>(data[0]);
</script>

<template>
  <div style="display: flex">
    <div class="book-list" style="width: 280px; display: flex; flex-wrap: wrap; margin-right: 16px">
      <CheckboxGroup v-model="checked" style="width: 100%"
        ><List
          :data-source="items"
          :split="false"
          size="small"
          style="flex-basis: 100%; flex-shrink: 0; border: 1px solid var(--semi-color-border)"
          ><template #item="{ item }"
            ><ListItem class="list-item"
              ><Checkbox :value="item">{{ item }}</Checkbox></ListItem
            ></template
          ></List
        ></CheckboxGroup
      >
    </div>
    <div class="book-list" style="width: 280px; display: flex; flex-wrap: wrap; margin-right: 16px">
      <RadioGroup v-model="selected" style="width: 100%"
        ><List
          :data-source="items"
          :split="false"
          size="small"
          style="flex-basis: 100%; flex-shrink: 0; border: 1px solid var(--semi-color-border)"
          ><template #item="{ item }"
            ><ListItem class="list-item"
              ><Radio :value="item">{{ item }}</Radio></ListItem
            ></template
          ></List
        ></RadioGroup
      >
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
