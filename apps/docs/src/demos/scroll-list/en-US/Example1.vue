<script setup lang="ts">
import { shallowRef } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { ScrollItem, ScrollList, type ScrollItemSelectData } from '@aifuxi/semi-ui-vue/scroll-list';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/scroll-list.css';

const selectIndex1 = shallowRef(1);
const selectIndex2 = shallowRef(1);
const selectIndex3 = shallowRef(1);
const ampms = [{ value: 'AM' }, { value: 'PM' }];
const hours = Array.from({ length: 12 }, (_, index) => ({ value: index + 1 }));
// Keep disabled minutes stable across rendering and resets instead of using Math.random().
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
    <template #header>Infinite Scroll List</template>
    <ScrollItem
      aria-label="AM/PM"
      mode="wheel"
      :cycled="false"
      :list="ampms"
      :type="1"
      :selected-index="selectIndex1"
      @select="onSelectAP"
    />
    <ScrollItem
      aria-label="Hour"
      mode="wheel"
      cycled
      :list="hours"
      :type="2"
      :selected-index="selectIndex2"
      @select="onSelectHour"
    />
    <ScrollItem
      aria-label="Minute"
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
