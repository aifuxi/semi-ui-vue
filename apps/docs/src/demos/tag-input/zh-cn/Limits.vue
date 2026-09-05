<script setup lang="ts">
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import '@aifuxi/semi-theme-default/tag-input.css';
import { Toast } from '@aifuxi/semi-ui-vue/toast';
import '@aifuxi/semi-theme-default/toast.css';
function onExceed(value: string[]) {
  Toast.warning('超过 max');
  console.log(value);
}
function onInputExceed(value: string) {
  Toast.warning('超过 maxLength');
  console.log(value);
}
</script>

<template>
  <div>
    <TagInput
      :max="3"
      placeholder="最多输入3条标签.."
      @change="console.log"
      @exceed="onExceed"
    /><TagInput
      :max-length="5"
      placeholder="单个标签长度不超过5..."
      style="margin-top: 12px"
      @change="console.log"
      @input-exceed="onInputExceed"
    />
  </div>
</template>
