<script setup lang="ts">
import { ref } from 'vue';
import { Sidebar } from '@aifuxi/semi-ui-vue/sidebar';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Switch } from '@aifuxi/semi-ui-vue/switch';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/sidebar.css';
const visible = ref(true),
  motion = ref(true),
  resizable = ref(true);
</script>
<template>
  <ConfigProvider :locale="locale"
    ><div
      style="
        display: flex;
        height: 500px;
        border: 1px solid var(--semi-color-border);
        border-radius: 8px;
        overflow: hidden;
        box-sizing: border-box;
      "
    >
      <div style="flex: 1; padding: 20px">
        <Button @click="visible = !visible"
          >Click to {{ visible ? 'hide' : 'show' }} container</Button
        ><label style="display: flex; gap: 8px; align-items: center; margin-top: 10px"
          >Motion<Switch v-model="motion" aria-label="Motion" /></label
        ><label style="display: flex; gap: 8px; align-items: center; margin-top: 10px"
          >Resizable<Switch v-model="resizable" aria-label="Resizable"
        /></label>
      </div>
      <Sidebar.Container
        :visible="visible"
        :motion="motion"
        :resizable="resizable"
        :min-width="250"
        max-width="60%"
        title="Basic container example"
        :style="resizable ? {} : { width: '200px' }"
        @cancel="visible = false"
      /></div
  ></ConfigProvider>
</template>
