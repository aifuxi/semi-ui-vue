<script setup lang="ts">
import { onBeforeUnmount, shallowRef } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Toast } from '@aifuxi/semi-ui-vue/toast';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/toast.css';

const toastId = shallowRef<string | null>(null);

function clearId() {
  toastId.value = null;
}

function show() {
  if (toastId.value !== null) return;
  toastId.value = Toast.info({ content: 'Not auto close', duration: 0, onClose: clearId });
}

function hide() {
  if (toastId.value !== null) Toast.close(toastId.value);
  clearId();
}

onBeforeUnmount(hide);
</script>

<template>
  <Button type="primary" @click="show">Show Toast</Button>
  <br />
  <br />
  <Button type="primary" @click="hide">Hide Toast</Button>
</template>
