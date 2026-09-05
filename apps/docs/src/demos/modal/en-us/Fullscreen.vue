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
function onClose() {
  visible.value = false;
}
</script>
<template>
  <ConfigProvider :locale="enUS">
    <Button @click="() => (visible = true)"> Open Full Screen Modal</Button>
    <Modal
      title="Title of Modal"
      full-screen
      :visible="visible"
      :on-ok="onClose"
      :on-cancel="onClose"
    >
      <p>This is a full screen modal</p>
      <p>More content...</p>
    </Modal>
  </ConfigProvider>
</template>
