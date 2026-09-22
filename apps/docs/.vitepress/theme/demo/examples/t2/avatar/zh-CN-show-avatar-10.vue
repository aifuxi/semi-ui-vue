<script setup lang="ts">
import { h } from 'vue';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
import IconPlus from '@aifuxi/semi-icons-vue/icons/IconPlus';
const squareSlot = { shape: 'square' as const, bgColor: '#FE2C55', text: '直播中' };
const circleSlot = { shape: 'circle' as const, bgColor: '#FE2C55', text: h(IconPlus) };
</script>

<template>
  <div>
    <Avatar color="amber" :bottom-slot="squareSlot">T</Avatar>
    <Avatar color="amber" size="large" :bottom-slot="squareSlot">T</Avatar>
    <Avatar color="amber" size="extra-large" :bottom-slot="squareSlot">T</Avatar>
    <br /><br /><br />
    <Avatar color="amber" :bottom-slot="circleSlot">T</Avatar>
    <Avatar color="amber" size="large" :bottom-slot="circleSlot">T</Avatar>
    <Avatar color="amber" size="extra-large" :bottom-slot="circleSlot">T</Avatar>
  </div>
</template>
