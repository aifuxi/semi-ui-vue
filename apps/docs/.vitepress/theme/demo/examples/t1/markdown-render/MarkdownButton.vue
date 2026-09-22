<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
defineEmits<{ click: [event: MouseEvent] }>();
</script>
<template>
  <Button type="primary" style="margin-bottom: 12px" @click="$emit('click', $event)"
    ><slot
  /></Button>
</template>
