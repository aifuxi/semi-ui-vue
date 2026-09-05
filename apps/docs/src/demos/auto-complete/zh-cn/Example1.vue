<script setup lang="ts">
import { ref } from 'vue';
import { AutoComplete } from '@aifuxi/semi-ui-vue/auto-complete';

const value = ref('');
const data = ref<string[]>([]);
function search(input: string) {
  data.value = input
    ? ['gmail.com', '163.com', 'qq.com'].map((domain) => `${input}@${domain}`)
    : [];
}
import '@aifuxi/semi-theme-default/auto-complete.css';
</script>

<template>
  <AutoComplete
    v-model="value"
    :data="data"
    show-clear
    placeholder="搜索..."
    style="width: 220px"
    @search="search"
  />
</template>
