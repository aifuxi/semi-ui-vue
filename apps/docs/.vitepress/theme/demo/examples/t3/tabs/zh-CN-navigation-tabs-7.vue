<script setup lang="ts">
import { Tabs, TabPane } from '@aifuxi/semi-ui-vue/tabs';
import '@aifuxi/semi-theme-default/tabs.css';
</script>

<template>
  <Tabs :style="{ width: '60%', margin: '20px' }" type="card" :more="4"
    ><TabPane v-for="i in 10" :key="i - 1" :tab="`Tab-${i - 1}`" :item-key="`Tab-${i - 1}`"
      >Content of card tab {{ i - 1 }}</TabPane
    ></Tabs
  >
</template>
