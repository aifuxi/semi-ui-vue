<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
</script>

<template>
  <div class="button-row">
    <Button type="primary">主要按钮</Button>
    <Button type="secondary">次要按钮</Button>
    <Button type="tertiary">第三按钮</Button>
    <Button type="warning">警告按钮</Button>
    <Button type="danger">危险按钮</Button>
  </div>
</template>

<style scoped>
.button-row > :deep(.semi-button) {
  margin-right: 8px;
}
</style>
