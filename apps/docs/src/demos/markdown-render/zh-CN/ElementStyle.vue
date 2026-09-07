<script setup lang="ts">
import { MarkdownRender } from '@aifuxi/semi-ui-vue/markdown-render';
import '@aifuxi/semi-theme-default/markdown-render.css';
import SecondaryHeading from './SecondaryHeading.vue';
const components = { ...MarkdownRender.defaultComponents, h2: SecondaryHeading };
const raw = '## 从 Semi Design 到 Any Design  快速定义你的设计系统，并应用在设计稿和代码中';
</script>
<template><MarkdownRender :raw="raw" :components="components" /></template>
