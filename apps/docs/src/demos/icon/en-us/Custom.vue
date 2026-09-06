<script setup lang="ts">
import '@aifuxi/semi-theme-default/icon.css';
import Icon from '@aifuxi/semi-icons-vue';
import CustomSvg from './CustomSvg.vue';
</script>

<template>
  <div>
    <Icon><CustomSvg /></Icon><Icon :rotate="180"><CustomSvg /></Icon>
  </div>
</template>
