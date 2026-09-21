<script setup lang="ts">
import { Modal } from '@aifuxi/semi-ui-vue/modal';
import '@aifuxi/semi-theme-default/modal.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { h, shallowRef, type VNodeChild } from 'vue';
import { DragMove } from '@aifuxi/semi-ui-vue/drag-move';
import '@aifuxi/semi-theme-default/drag-move.css';
const visible = shallowRef(false);
function close() {
  visible.value = false;
}
function renderModal(dialog: VNodeChild) {
  return h(DragMove, { positionStrategy: 'relative' }, { default: () => dialog });
}
</script>
<template>
  <div>
    <Button @click="visible = true">Open Modal</Button
    ><Modal
      title="可拖拽Modal"
      :visible="visible"
      centered
      :on-cancel="close"
      :modal-render="renderModal"
      ><p>This is the content of a basic sidesheet.</p>
      <p>Here is more content...</p></Modal
    >
  </div>
</template>
