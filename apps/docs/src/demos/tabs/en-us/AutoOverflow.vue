<script setup lang="ts">
import { shallowRef } from 'vue';
import { Tabs, TabPane } from '@aifuxi/semi-ui-vue/tabs';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/tabs.css';
import '@aifuxi/semi-theme-default/button.css';
const count = shallowRef(8);
</script>

<template>
  <div>
    <div style="margin-bottom: 12px">
      <Button style="margin-right: 8px" @click="count = Math.max(3, count - 2)">Reduce Tabs</Button
      ><Button @click="count = Math.min(15, count + 2)">Increase Tabs</Button
      ><span style="margin-left: 12px">Current tab count: {{ count }}</span>
    </div>
    <div style="border: 1px solid var(--semi-color-border); padding: 12px; margin-bottom: 16px">
      <p style="margin-bottom: 8px; color: var(--semi-color-text-2); font-size: 12px">
        collapsible=&quot;auto&quot; - Auto detect overflow
      </p>
      <Tabs type="card" collapsible="auto"
        ><TabPane v-for="i in count" :key="i - 1" :tab="`Tab-${i}`" :item-key="String(i - 1)"
          >Content of Tab {{ i }}</TabPane
        ></Tabs
      >
    </div>
    <div style="border: 1px solid var(--semi-color-border); padding: 12px; max-width: 400px">
      <p style="margin-bottom: 8px; color: var(--semi-color-text-2); font-size: 12px">
        Fixed width 400px, test with narrow container
      </p>
      <Tabs type="card" collapsible="auto"
        ><TabPane v-for="i in count" :key="i - 1" :tab="`Tab-${i}`" :item-key="String(i - 1)"
          >Content of Tab {{ i }}</TabPane
        ></Tabs
      >
    </div>
  </div>
</template>
