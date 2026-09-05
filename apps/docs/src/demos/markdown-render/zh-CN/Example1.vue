<script setup lang="ts">
import { MarkdownRender } from '@aifuxi/semi-ui-vue/markdown-render';
import '@aifuxi/semi-theme-default/markdown-render.css';

const raw = `## 发布说明

支持 **粗体**、[链接](https://semi.design)、\`inline code\` 和 GFM 表格。

| 能力 | 状态 |
| - | - |
| Markdown | Ready |`;
</script>

<template>
  <MarkdownRender :raw="raw" />
</template>
