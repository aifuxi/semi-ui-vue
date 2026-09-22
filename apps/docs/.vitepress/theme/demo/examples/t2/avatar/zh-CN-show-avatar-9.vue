<script setup lang="ts">
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
const topSlot = { text: '直播', gradientStart: 'rgb(255,23,100)', gradientEnd: 'rgb(237,52,148)' };
</script>

<template>
  <div>
    <Avatar color="amber" :top-slot="topSlot">T</Avatar>
    <Avatar color="amber" size="large" :top-slot="topSlot">T</Avatar>
    <Avatar color="amber" size="extra-large" :top-slot="topSlot">T</Avatar>
  </div>
</template>
