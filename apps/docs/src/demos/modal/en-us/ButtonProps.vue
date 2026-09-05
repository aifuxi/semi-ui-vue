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
    <Button @click="showDialog"> Custom Button Properties</Button>
    <Modal
      title="Custom Button Properties"
      :visible="visible"
      :on-ok="handleOk"
      :on-cancel="handleCancel"
      :ok-button-props="{ size: 'small', type: 'warning' }"
      :cancel-button-props="{ size: 'small', disabled: true }"
    >
      <p>This is a modal with customized button props.</p>
      <p>More content...</p>
    </Modal>
  </ConfigProvider>
</template>
