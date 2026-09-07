<script setup lang="ts">
import { shallowRef } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { ScrollItem, ScrollList, type ScrollItemSelectData } from '@aifuxi/semi-ui-vue/scroll-list';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/scroll-list.css';

const selectIndex1 = shallowRef(1);
const selectIndex2 = shallowRef(1);
const selectIndex3 = shallowRef(1);
const ampms = [{ value: '上午' }, { value: '下午' }];
const hours = Array.from({ length: 12 }, (_, index) => ({ value: index + 1 }));
// 用固定序列替代 Math.random()，保持渲染与重置时的禁用分钟一致。
const minutes = Array.from({ length: 60 }, (_, index) => ({
  value: index,
  disabled: index % 2 === 0,
}));

function onSelectAP(data: ScrollItemSelectData): void {
  if (data.type === 1) selectIndex1.value = data.index;
}

function onSelectHour(data: ScrollItemSelectData): void {
  console.log('You have choose the hour for: ', data.value);
  if (data.type === 2) selectIndex2.value = data.index;
}

function onSelectMinute(data: ScrollItemSelectData): void {
  console.log('You have choose the minute for: ', data.value);
  if (data.type === 3) selectIndex3.value = data.index;
}

function handleClose(): void {
  console.log('close');
}
</script>

<template>
  <ScrollList :style="{ border: 'unset', boxShadow: 'unset' }">
    <template #header>无限滚动列表</template>
    <ScrollItem
      aria-label="时段"
      mode="wheel"
      :cycled="false"
      :list="ampms"
      :type="1"
      :selected-index="selectIndex1"
      @select="onSelectAP"
    />
    <ScrollItem
      aria-label="小时"
      mode="wheel"
      cycled
      :list="hours"
      :type="2"
      :selected-index="selectIndex2"
      @select="onSelectHour"
    />
    <ScrollItem
      aria-label="分钟"
      mode="wheel"
      cycled
      :list="minutes"
      :type="3"
      :selected-index="selectIndex3"
      @select="onSelectMinute"
    />
    <template #footer>
      <Button size="small" type="primary" @click="handleClose">Ok</Button>
    </template>
  </ScrollList>
</template>
