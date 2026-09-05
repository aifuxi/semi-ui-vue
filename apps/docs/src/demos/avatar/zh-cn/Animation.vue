<script setup lang="ts">
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
</script>

<template>
  <div>
    <Avatar color="amber" :border="{ motion: true }" style="margin-right: 8px" content-motion
      >T</Avatar
    >
    <Avatar
      color="amber"
      :border="{ motion: true }"
      size="large"
      style="margin-right: 8px"
      content-motion
      >T</Avatar
    >
    <Avatar
      color="amber"
      :border="{ motion: true }"
      size="extra-large"
      style="margin-right: 8px"
      content-motion
      >T</Avatar
    >
  </div>
</template>
