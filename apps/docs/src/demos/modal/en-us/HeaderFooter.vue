<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/config-provider.css';
import { Modal } from '@aifuxi/semi-ui-vue/modal';
import '@aifuxi/semi-theme-default/modal.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { shallowRef } from 'vue';
const visible = shallowRef(false);
function showDialog() {
  visible.value = true;
}
function handleOk() {
  visible.value = false;
}
function handleCancel() {
  visible.value = false;
}
</script>
<template>
  <ConfigProvider :locale="enUS">
    <Button @click="showDialog">Customized Footer</Button>
    <Modal title="Customized Footer" :visible="visible" :on-ok="handleOk" :on-cancel="handleCancel">
      <p>This is a modal with a customized footer.</p>
      <p>More content...</p>
      <template #footer
        ><Button type="primary" @click="handleOk">Yes, I Understand</Button></template
      ></Modal
    >
  </ConfigProvider>
</template>
