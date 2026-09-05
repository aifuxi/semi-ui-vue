<script setup lang="ts">
import { AutoComplete } from '@aifuxi/semi-ui-vue/auto-complete';
import '@aifuxi/semi-theme-default/auto-complete.css';
import { IconSearch } from '@aifuxi/semi-icons-vue';
import { shallowRef } from 'vue';
import type { AutoCompletePrimitive } from '@aifuxi/semi-ui-vue/auto-complete';
const stringData = shallowRef<string[]>([]);
const value = shallowRef<AutoCompletePrimitive>('');
function handleStringSearch(input: string) {
  stringData.value = input
    ? ['gmail.com', '163.com', 'qq.com'].map((domain) => `${input}@${domain}`)
    : [];
}
function handleChange(next: AutoCompletePrimitive) {
  console.log('onChange', next);
  value.value = next;
}
</script>
<template>
  <div>
    <AutoComplete
      :data="stringData"
      :value="value"
      show-clear
      placeholder="Search... "
      :style="{ width: '200px' }"
      @search="handleStringSearch"
      @change="handleChange"
      ><template #prefix><IconSearch></IconSearch></template
    ></AutoComplete>
  </div>
</template>
