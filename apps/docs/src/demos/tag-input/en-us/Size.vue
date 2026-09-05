<script setup lang="ts">
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import '@aifuxi/semi-theme-default/tag-input.css';
</script>

<template>
  <div>
    <TagInput size="small" placeholder="small"></TagInput>
    <br /><br />
    <TagInput placeholder="default"></TagInput>
    <br /><br />
    <TagInput size="large" placeholder="large"></TagInput>
  </div>
</template>
