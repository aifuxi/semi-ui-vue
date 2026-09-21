<script setup lang="ts">
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import '@aifuxi/semi-theme-default/tag-input.css';
</script>

<template>
  <div>
    <TagInput placeholder="default"></TagInput>
    <br /><br />
    <TagInput placeholder="warning" validate-status="warning"></TagInput>
    <br /><br />
    <TagInput placeholder="error" validate-status="error"></TagInput>
  </div>
</template>
