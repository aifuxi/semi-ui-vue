<script setup lang="ts">
import { MarkdownRender } from '@aifuxi/semi-ui-vue/markdown-render';
import '@aifuxi/semi-theme-default/markdown-render.css';
import MarkdownButton from './MarkdownButton.vue';
const components = { ...MarkdownRender.defaultComponents, MyButton: MarkdownButton };
const raw =
  '\n#### 下面是一个渲染在 Markdown 中的按钮\n<MyButton onClick={()=>alert("点击了 MyButton")}>MyButton 点我</MyButton>\n\n直接在 Markdown 中书写 JSX 即可\n        ';
</script>
<template><MarkdownRender :raw="raw" :components="components" /></template>
