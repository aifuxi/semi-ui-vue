<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Toast } from '@aifuxi/semi-ui-vue/toast';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/toast.css';

function show() {
  Toast.info({ content: 'Hi, AIFUXI dance dance', duration: 10, stack: true });
}
</script>

<template>
  <Button @click="show">Click multiple times</Button>
</template>
