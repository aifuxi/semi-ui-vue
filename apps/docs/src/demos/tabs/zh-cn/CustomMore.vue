<script setup lang="ts">
import { Tabs, TabPane } from '@aifuxi/semi-ui-vue/tabs';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/tabs.css';
import '@aifuxi/semi-theme-default/button.css';
</script>

<template>
  <Tabs
    :style="{ width: '60%', margin: '20px' }"
    type="card"
    :more="{ count: 4, dropdownProps: { trigger: 'click', position: 'bottomRight' } }"
    ><template #more><Button type="tertiary">Click to show More</Button></template
    ><TabPane v-for="i in 10" :key="i - 1" :tab="`Tab-${i - 1}`" :item-key="`Tab-${i - 1}`"
      >Content of card tab {{ i - 1 }}</TabPane
    ></Tabs
  >
</template>
