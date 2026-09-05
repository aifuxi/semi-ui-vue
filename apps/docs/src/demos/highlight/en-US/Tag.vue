<script setup lang="ts">
import { Highlight } from '@aifuxi/semi-ui-vue/highlight';
import '@aifuxi/semi-theme-default/highlight.css';
const sourceString =
  'From Semi Design，To Any Design. Quickly define your design system and apply it to design drafts and code';
const searchWords = ['Any Design', 'Semi Design'];
</script>
<template>
  <h2>
    <Highlight :source-string="sourceString" :search-words="searchWords" component="strong" />
  </h2>
</template>
