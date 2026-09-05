<script setup lang="ts">
import { IconButton } from '@aifuxi/semi-ui-vue/icon-button';
import { IconStar } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/icon-button.css';
</script>

<template>
  <IconButton aria-label="Favorite">
    <template #icon><IconStar /></template>
  </IconButton>

  <IconButton icon-position="right">
    <template #icon><IconStar /></template>
    Favorite
  </IconButton>
</template>
