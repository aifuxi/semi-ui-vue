<script setup lang="ts">
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import '@aifuxi/semi-theme-default/tag-input.css';
function onChange(value: string[]) {
  console.log(`onChange ：${value}`);
}
function onAdd(value: string[]) {
  console.log(`onAdd ：${value}`);
}
function onRemove(value: string, index: number) {
  console.log(`onRemove ：${value}, index：${index}`);
}
function onInputChange(value: string) {
  console.log(`onInputChange ：${value}`);
}
</script>

<template>
  <TagInput
    :default-value="['Semi', 'Design2Code']"
    show-clear
    @focus="console.log('onFocus')"
    @blur="console.log('onBlur')"
    @change="onChange"
    @add="onAdd"
    @remove="onRemove"
    @input-change="onInputChange"
  />
</template>
