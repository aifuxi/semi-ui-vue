<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Toast } from '@aifuxi/semi-ui-vue/toast';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/toast.css';

const options = {
  content: 'Hi, AIFUXI dance dance',
  duration: 3,
  theme: 'light' as const,
};
</script>

<template>
  <Button @click="() => Toast.info(options)">Info</Button>
  <br />
  <br />
  <Button :style="{ color: 'var(--semi-color-success)' }" @click="() => Toast.success(options)"
    >Success</Button
  >
  <br />
  <br />
  <Button type="warning" @click="() => Toast.warning(options)">Warning</Button>
  <br />
  <br />
  <Button type="danger" @click="() => Toast.error(options)">Error</Button>
</template>
