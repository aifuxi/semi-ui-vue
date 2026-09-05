<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
</script>

<template>
  <div class="button-row">
    <Button type="primary">Primary Button</Button>
    <Button type="secondary">Secondary Button</Button>
    <Button type="tertiary">Tertiary Button</Button>
    <Button type="warning">Warning Button</Button>
    <Button type="danger">Danger Button</Button>
  </div>
</template>

<style scoped>
.button-row > :deep(.semi-button) {
  margin-right: 8px;
}
</style>
