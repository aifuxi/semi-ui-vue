<script setup lang="ts">
import { h } from 'vue';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
import IconPlus from '@aifuxi/semi-icons-vue/icons/IconPlus';
const topSlot = { text: 'LIVE', gradientStart: 'rgb(255,23,100)', gradientEnd: 'rgb(237,52,148)' };
const bottomSlot = { shape: 'circle' as const, bgColor: '#FE2C55', text: h(IconPlus) };
</script>

<template>
  <Avatar
    alt="beautiful cat"
    src="/demos/photo.svg"
    style="margin: 4px"
    size="large"
    :border="{ color: '#FE2C55', motion: true }"
    content-motion
    :top-slot="topSlot"
    :bottom-slot="bottomSlot"
  />
</template>
