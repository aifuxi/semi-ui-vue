<script setup lang="ts">
import { MarkdownRender } from '@aifuxi/semi-ui-vue/markdown-render';
import '@aifuxi/semi-theme-default/markdown-render.css';
import PrimaryHeading from './PrimaryHeading.vue';
const components = { h1: PrimaryHeading };
const raw = 'Symbols that do not need to be escaped{}<> ...';
</script>
<template><MarkdownRender :raw="raw" format="md" :components="components" /></template>
