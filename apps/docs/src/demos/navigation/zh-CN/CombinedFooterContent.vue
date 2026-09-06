<script setup lang="ts">
import { IconApps } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/navigation.css';
</script>
<template>
  <span
    :style="{
      display: 'flex',
      alignItems: 'center',
    }"
  >
    <IconApps size="large" :style="{ marginRight: '8px' }"></IconApps>
    <span>Component workspace</span>
  </span>
  <span>
    <span :style="{ marginRight: '24px' }">平台客服</span>
    <span>反馈建议</span>
  </span>
</template>
