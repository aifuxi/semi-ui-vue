<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/config-provider.css';
import { SideSheet } from '@aifuxi/semi-ui-vue/side-sheet';
import '@aifuxi/semi-theme-default/side-sheet.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { shallowRef } from 'vue';
const visible = shallowRef(false);
function change() {
  visible.value = !visible.value;
}
</script>
<template>
  <ConfigProvider :locale="enUS">
    <Button @click="change"> Open SideSheet</Button>
    <SideSheet title="Sidesheet" :visible="visible" @cancel="change">
      <p>This is the content of a basic sidesheet.</p>
      <p>Here is more content...</p>
    </SideSheet>
  </ConfigProvider>
</template>
