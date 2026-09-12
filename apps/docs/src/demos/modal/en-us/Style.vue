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
    <Button @click="showDialog">Custom Style</Button>
    <Modal
      title="Custom Style"
      :visible="visible"
      :on-ok="handleOk"
      :on-cancel="handleCancel"
      centered
      :body-style="{ overflow: 'auto', height: '200px' }"
    >
      <p :style="{ lineHeight: 1.8 }">
        Semi Design is a design system developed and maintained by IES Front-end Team and UED Team
      </p>
      <p :style="{ lineHeight: 1.8 }">
        Semi Design create a consistent, good-looking, easy-to-use, and efficient user experience
        with a user-centric, content-first, and human-friendly design system.
      </p>
      <ul>
        <li><p>Content-first</p></li>
        <li><p>Customized theming</p></li>
        <li><p>Internationalized</p></li>
        <li><p>Humanism</p></li>
      </ul>
    </Modal>
  </ConfigProvider>
</template>
