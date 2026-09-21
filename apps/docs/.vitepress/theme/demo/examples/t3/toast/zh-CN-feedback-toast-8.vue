<script setup lang="ts">
import { onBeforeUnmount, useId } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Toast } from '@aifuxi/semi-ui-vue/toast';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/toast.css';

// Keep one id per demo instance so separate previews do not update each other.
const id = useId();
const timers = new Set<ReturnType<typeof setTimeout>>();

function show() {
  Toast.info({ content: 'Update Content By Id', id });
  const timer = setTimeout(() => {
    timers.delete(timer);
    Toast.success({ content: 'Id By Content Update', id });
  }, 1000);
  timers.add(timer);
}

onBeforeUnmount(() => {
  for (const timer of timers) clearTimeout(timer);
  Toast.close(id);
});
</script>

<template>
  <Button type="primary" @click="show">Update Content By Id</Button>
</template>
