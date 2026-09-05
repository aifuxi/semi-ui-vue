<script setup lang="ts">
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import '@aifuxi/semi-theme-default/tag-input.css';
import { Toast } from '@aifuxi/semi-ui-vue/toast';
import '@aifuxi/semi-theme-default/toast.css';
function onExceed(value: string[]) {
  Toast.warning('Exceeds max');
  console.log(value);
}
function onInputExceed(value: string) {
  Toast.warning('Exceeds maxLength');
  console.log(value);
}
</script>

<template>
  <div>
    <TagInput :max="3" placeholder="max = 3" @change="console.log" @exceed="onExceed" /><TagInput
      :max-length="5"
      placeholder="maxLength = 5"
      style="margin-top: 12px"
      @change="console.log"
      @input-exceed="onInputExceed"
    />
  </div>
</template>
