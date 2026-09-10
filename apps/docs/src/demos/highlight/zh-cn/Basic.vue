<script setup lang="ts">
import { Highlight } from '@aifuxi/semi-ui-vue/highlight';
import '@aifuxi/semi-theme-default/highlight.css';
const sourceString = '从 Semi Design 到 Any Design  快速定义你的设计系统，并应用在设计稿和代码中';
const searchWords = ['设计系统', 'Semi Design'];
</script>
<template>
  <h2>
    <Highlight :source-string="sourceString" :search-words="searchWords" />
  </h2>
</template>
