<script setup lang="ts">
import { shallowRef } from 'vue';
import { Button, Modal } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/modal.css';

const visible = shallowRef(false);
const saved = shallowRef(false);

function open() {
  saved.value = false;
  visible.value = true;
}

function close() {
  visible.value = false;
}

async function save() {
  await Promise.resolve();
  saved.value = true;
  close();
}
</script>

<template>
  <div>
    <Button theme="solid" @click="open">Open modal</Button>
    <span role="status">{{ saved ? 'Changes saved.' : 'No changes saved yet.' }}</span>
    <Modal
      v-model:visible="visible"
      title="Publish changes"
      ok-text="Publish"
      cancel-text="Review later"
      :on-ok="save"
      :on-cancel="close"
    >
      This action publishes the current component documentation.
    </Modal>
  </div>
</template>
