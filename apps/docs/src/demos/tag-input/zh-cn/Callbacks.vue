<script setup lang="ts">
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import '@aifuxi/semi-theme-default/tag-input.css';
function onChange(value: string[]) {
  console.log(`onChange,当前标签数组：${value}`);
}
function onAdd(value: string[]) {
  console.log(`onAdd，新增：${value}`);
}
function onRemove(value: string, index: number) {
  console.log(`onRemove，移除：${value}, 序号：${index}`);
}
function onInputChange(value: string) {
  console.log(`onInputChange，当前输入内容：${value}`);
}
</script>

<template>
  <TagInput
    :default-value="['抖音']"
    placeholder="请输入..."
    show-clear
    @focus="console.log('onFocus')"
    @blur="console.log('onBlur')"
    @change="onChange"
    @add="onAdd"
    @remove="onRemove"
    @input-change="onInputChange"
  />
</template>
