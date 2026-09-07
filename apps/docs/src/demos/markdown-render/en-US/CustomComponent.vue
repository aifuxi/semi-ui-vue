<script setup lang="ts">
import { MarkdownRender } from '@aifuxi/semi-ui-vue/markdown-render';
import '@aifuxi/semi-theme-default/markdown-render.css';
import MarkdownButton from './MarkdownButton.vue';
const components = { ...MarkdownRender.defaultComponents, MyButton: MarkdownButton };
const raw =
  '\n#### Below is a button rendered in Markdown\n<MyButton onClick={()=>alert("MyButton is clicked")}>MyButton click me</MyButton>\n\nJust write JSX directly in Markdown\n        ';
</script>
<template><MarkdownRender :raw="raw" :components="components" /></template>
