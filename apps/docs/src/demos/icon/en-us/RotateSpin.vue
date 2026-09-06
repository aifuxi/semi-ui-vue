<script setup lang="ts">
import '@aifuxi/semi-theme-default/icon.css';
import { IconHome, IconEmoji, IconSpin } from '@aifuxi/semi-icons-vue';
</script>

<template>
  <div>
    <IconHome size="small" />
    <IconEmoji :rotate="180" />
    <IconSpin spin />
  </div>
</template>
