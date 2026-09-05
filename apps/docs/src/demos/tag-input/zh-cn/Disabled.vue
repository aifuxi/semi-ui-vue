<script setup lang="ts">
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import '@aifuxi/semi-theme-default/tag-input.css';
</script>

<template>
  <TagInput
    disabled
    show-clear
    :default-value="['\u6296\u97F3', '\u706B\u5C71', '\u897F\u74DC\u89C6\u9891']"
    placeholder="请输入..."
  ></TagInput>
</template>
