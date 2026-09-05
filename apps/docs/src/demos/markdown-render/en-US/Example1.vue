<script setup lang="ts">
import { MarkdownRender } from '@aifuxi/semi-ui-vue/markdown-render';
import '@aifuxi/semi-theme-default/markdown-render.css';

const raw = `## Release notes

Use **bold**, [links](https://semi.design), \`inline code\`, and GFM tables.

| Feature | Status |
| - | - |
| Markdown | Ready |`;
</script>

<template>
  <MarkdownRender :raw="raw" />
</template>
