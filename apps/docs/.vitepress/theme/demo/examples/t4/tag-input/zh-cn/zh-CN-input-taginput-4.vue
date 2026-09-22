<script setup lang="ts">
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import '@aifuxi/semi-theme-default/tag-input.css';
</script>

<template>
  <TagInput
    show-clear
    :default-value="['\u6296\u97F3', '\u706B\u5C71']"
    placeholder="请输入..."
    @change="console.log"
  ></TagInput>
</template>
