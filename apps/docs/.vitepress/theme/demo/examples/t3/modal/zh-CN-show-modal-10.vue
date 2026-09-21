<script setup lang="ts">
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
  <Button @click="() => (visible = true)"> 打开全屏弹窗</Button>
  <Modal
    title="全屏对话框标题"
    full-screen
    :visible="visible"
    :on-ok="onClose"
    :on-cancel="onClose"
  >
    <p>This is a full screen modal</p>
    <p>More content...</p>
  </Modal>
</template>
