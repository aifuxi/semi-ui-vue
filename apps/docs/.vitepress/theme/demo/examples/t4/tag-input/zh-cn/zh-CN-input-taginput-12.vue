<script setup lang="ts">
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import '@aifuxi/semi-theme-default/tag-input.css';
</script>

<template>
  <TagInput
    :max-tag-count="2"
    :show-rest-tags-popover="true"
    :rest-tags-popover-props="{ position: 'top' }"
    :default-value="['\u6296\u97F3', '\u706B\u5C71', '\u897F\u74DC\u89C6\u9891']"
    @change="console.log"
  ></TagInput>
</template>
