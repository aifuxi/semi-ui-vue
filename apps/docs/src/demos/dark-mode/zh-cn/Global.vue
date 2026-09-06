<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
const emit = defineEmits<{ themeChange: [theme: 'light' | 'dark'] }>();
function switchMode() {
  const body = document.body;
  const dark = body.getAttribute('theme-mode') !== 'dark';
  if (dark) body.setAttribute('theme-mode', 'dark');
  else body.removeAttribute('theme-mode');
  // Optional host notification; the example also runs independently in the editor.
  emit('themeChange', dark ? 'dark' : 'light');
}
</script>
<template><Button @click="switchMode">Switch Mode</Button></template>
