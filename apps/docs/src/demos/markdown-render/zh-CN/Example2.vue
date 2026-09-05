<script setup lang="ts">
import { h, type FunctionalComponent } from 'vue';
import { MarkdownRender } from '@aifuxi/semi-ui-vue/markdown-render';

const components: Record<string, FunctionalComponent> = {
  h2: (_props, { slots }) => h('h2', { class: 'brand-heading' }, slots.default?.()),
  Notice: (_props, { slots }) => h('aside', { class: 'notice' }, slots.default?.()),
};
import '@aifuxi/semi-theme-default/markdown-render.css';
</script>

<template>
  <MarkdownRender raw="## 自定义标题\n\n<Notice>只渲染可信 MDX</Notice>" :components="components" />
</template>
