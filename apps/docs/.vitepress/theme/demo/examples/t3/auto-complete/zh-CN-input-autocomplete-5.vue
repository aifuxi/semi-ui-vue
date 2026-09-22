<script setup lang="ts">
import { AutoComplete } from '@aifuxi/semi-ui-vue/auto-complete';
import '@aifuxi/semi-theme-default/auto-complete.css';
</script>
<template>
  <div>
    <div>
      <AutoComplete
        :data="[1, 2, 3, 4]"
        size="small"
        placeholder="small"
        :style="{ width: '200px' }"
      ></AutoComplete>
      <br />
      <br />
      <AutoComplete
        :data="[1, 2, 3, 4]"
        size="default"
        placeholder="default"
        :style="{ width: '200px' }"
      ></AutoComplete>
      <br />
      <br />
      <AutoComplete
        :data="[1, 2, 3, 4]"
        size="large"
        placeholder="large"
        :style="{ width: '200px' }"
      ></AutoComplete>
    </div>
  </div>
</template>
