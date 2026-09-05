<script setup lang="ts">
import { Input, TextArea } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
import { shallowRef } from 'vue';
const inputValue = shallowRef('');
const textAreaValue = shallowRef('');
const inputLogs = shallowRef<string[]>([]);
const textAreaLogs = shallowRef<string[]>([]);
function handleInputChange(value: string) {
  inputValue.value = value;
  inputLogs.value = [...inputLogs.value, value];
}
function handleTextAreaChange(value: string) {
  textAreaValue.value = value;
  textAreaLogs.value = [...textAreaLogs.value, value];
}
</script>

<template>
  <div>
    <h4>Input with composition</h4>
    <Input
      composition
      :value="inputValue"
      placeholder="With composition, onChange is not triggered during IME input"
      style="width: 300px"
      @change="handleInputChange"
    />
    <div style="margin-top: 8px; color: var(--semi-color-text-2); font-size: 12px">
      onChange trigger count: {{ inputLogs.length }}
    </div>
    <br /><br />
    <h4>TextArea with composition</h4>
    <TextArea
      composition
      :value="textAreaValue"
      placeholder="With composition, onChange is not triggered during IME input"
      style="width: 300px"
      @change="handleTextAreaChange"
    />
    <div style="margin-top: 8px; color: var(--semi-color-text-2); font-size: 12px">
      onChange trigger count: {{ textAreaLogs.length }}
    </div>
  </div>
</template>
