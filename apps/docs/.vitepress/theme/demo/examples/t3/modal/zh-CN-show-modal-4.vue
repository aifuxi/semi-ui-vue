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
  <Button @click="showDialog">点击遮罩层不可关闭</Button>
  <Modal
    title="对话框标题"
    :visible="visible"
    :on-ok="handleOk"
    :on-cancel="handleCancel"
    :mask-closable="false"
  >
    <p>This is a modal that cannot be closed by clicking on the mask.</p>
    <p>More content...</p>
  </Modal>
</template>
