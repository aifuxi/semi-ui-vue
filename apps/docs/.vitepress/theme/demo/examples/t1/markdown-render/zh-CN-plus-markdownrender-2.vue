<script setup lang="ts">
import { MarkdownRender } from '@aifuxi/semi-ui-vue/markdown-render';

const raw = `
## 项目进度

- **已完成**：组件安装与主题配置
- *进行中*：页面开发

| 任务 | 状态 |
| --- | --- |
| 快速开始 | 已完成 |
| 表单页 | 进行中 |
`;
</script>

<template>
  <MarkdownRender :raw="raw" format="md" />
</template>
