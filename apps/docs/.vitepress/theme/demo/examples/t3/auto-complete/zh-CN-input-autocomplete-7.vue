<script setup lang="ts">
import { AutoComplete } from '@aifuxi/semi-ui-vue/auto-complete';
import '@aifuxi/semi-theme-default/auto-complete.css';
</script>
<template>
  <div>
    <AutoComplete
      :data="[1, 2, 3, 4]"
      placeholder="禁用下拉菜单"
      disabled
      :style="{ width: '200px' }"
    ></AutoComplete>
  </div>
</template>
