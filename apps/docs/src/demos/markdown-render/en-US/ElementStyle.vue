<script setup lang="ts">
import { MarkdownRender } from '@aifuxi/semi-ui-vue/markdown-render';
import '@aifuxi/semi-theme-default/markdown-render.css';
import SecondaryHeading from './SecondaryHeading.vue';
const components = { ...MarkdownRender.defaultComponents, h2: SecondaryHeading };
const raw =
  '## From Semi Design to Any Design, quickly define your design system and apply it in design drafts and codes';
</script>
<template><MarkdownRender :raw="raw" :components="components" /></template>
