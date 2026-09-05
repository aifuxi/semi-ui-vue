<script setup lang="ts">
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
  console.log('Ok button clicked');
}
function handleCancel() {
  visible.value = false;
  console.log('Cancel button clicked');
}
function handleAfterClose() {
  console.log('After Close callback executed');
}
</script>
<template>
  <Button @click="showDialog"> 打开弹窗</Button>
  <Modal
    title="基本对话框"
    :visible="visible"
    :on-ok="handleOk"
    :after-close="handleAfterClose"
    :on-cancel="handleCancel"
    :close-on-esc="true"
  >
    This is the content of a basic modal.
    <br />
    More content...
  </Modal>
</template>
