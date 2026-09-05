<script setup lang="ts">
import { AutoComplete } from '@aifuxi/semi-ui-vue/auto-complete';
import '@aifuxi/semi-theme-default/auto-complete.css';
</script>
<template>
  <div>
    <div>
      <AutoComplete
        :data="[1, 2, 3, 4]"
        position="top"
        placeholder="The options menu is shown at the top"
        :style="{ width: '300px', margin: '10px' }"
      ></AutoComplete>
      <AutoComplete
        :data="[1, 2, 3, 4]"
        position="rightTop"
        placeholder="The options menu is shown on the right"
        :style="{ width: '300px', margin: '10px' }"
      ></AutoComplete>
    </div>
  </div>
</template>
