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
}
function handleCancel() {
  visible.value = false;
}
</script>
<template>
  <Button @click="showDialog">自定义按钮文字</Button>
  <Modal
    title="自定义按钮文字"
    :visible="visible"
    :on-ok="handleOk"
    :on-cancel="handleCancel"
    :ok-text="'Sounds great!'"
    :cancel-text="'No, thanks.'"
  >
    <p>This is a modal with customized button texts.</p>
    <p>More content...</p>
  </Modal>
</template>
