<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Toast } from '@aifuxi/semi-ui-vue/toast';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/toast.css';

let lastShown: number | undefined;

function show() {
  Toast.info({ content: 'Hi, AIFUXI dance dance', duration: 3, stack: true });
}

function showThrottled() {
  const now = Date.now();
  // Leading-only 10s throttle; closing the toast permits the next call immediately.
  if (lastShown !== undefined && now - lastShown < 10_000) return;
  lastShown = now;
  Toast.info({
    content: 'Hi, AIFUXI dance dance',
    duration: 10,
    stack: true,
    onClose: () => {
      lastShown = undefined;
    },
  });
}
</script>

<template>
  <div>
    <Button @click="show">Display Toast</Button>
    <br />
    <br />
    <Button @click="showThrottled">Throttled Toast</Button>
  </div>
</template>
