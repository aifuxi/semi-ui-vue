<script setup lang="ts">
import { Highlight } from '@aifuxi/semi-ui-vue/highlight';
import '@aifuxi/semi-theme-default/highlight.css';
const sourceString =
  'From Semi Design，To Any Design. Quickly define your design system and apply it to design drafts and code';
const searchWords = ['Any Design', 'Semi Design'];
</script>
<template>
  <h2>
    <Highlight
      :source-string="sourceString"
      :search-words="searchWords"
      :highlight-style="{
        borderRadius: '6px',
        marginLeft: '4px',
        marginRight: '4px',
        paddingLeft: '4px',
        paddingRight: '4px',
        backgroundColor: 'rgba(var(--semi-teal-5), 1)',
        color: 'rgba(var(--semi-white), 1)',
      }"
    />
  </h2>
</template>
