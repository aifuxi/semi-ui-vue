<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import { MarkdownRender } from '@aifuxi/semi-ui-vue/markdown-render';
import type { ParityDirection } from '@workspace/test-infra';

const props = defineProps<{ direction: ParityDirection }>();

const raw = `## MarkdownRender 对齐

这是一个 **完整切片**，包含 [Semi Design](https://semi.design) 与 \`inline code\`。

- 固定 v2.102.0 源码
- Vue 原生组件映射

| 能力 | 状态 |
| - | -: |
| Markdown | Ready |
| GFM Table | Ready |
`;
</script>

<template>
  <ConfigProvider :direction="props.direction">
    <div class="markdown-render-scenario" data-testid="markdown-render-vue">
      <MarkdownRender :raw="raw" data-parity-target="markdown-render-root" />
    </div>
  </ConfigProvider>
</template>
