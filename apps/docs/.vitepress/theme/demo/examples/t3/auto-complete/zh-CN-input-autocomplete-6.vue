<script setup lang="ts">
import { AutoComplete } from '@aifuxi/semi-ui-vue/auto-complete';
import '@aifuxi/semi-theme-default/auto-complete.css';
import { shallowRef } from 'vue';
const data = shallowRef<string[]>([]);
function change(input: string) {
  data.value = input
    ? ['gmail.com', '163.com', 'qq.com'].map((domain) => `${input}@${domain}`)
    : [];
}
</script>
<template>
  <div>
    <div>
      <AutoComplete
        :data="data"
        position="top"
        placeholder="选项菜单在上方显示"
        :style="{ width: '200px', margin: '10px' }"
        @search="change"
      ></AutoComplete>
      <AutoComplete
        :data="data"
        position="rightTop"
        placeholder="选项菜单在右侧显示"
        :style="{ width: '200px', margin: '10px' }"
        @search="change"
      ></AutoComplete>
    </div>
  </div>
</template>
