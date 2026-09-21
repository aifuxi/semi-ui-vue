<script setup lang="ts">
import { Highlight } from '@aifuxi/semi-ui-vue/highlight';
import '@aifuxi/semi-theme-default/highlight.css';
</script>
<template>
  <h2>
    <Highlight
      component="span"
      source-string="从 Semi Design 到 Any Design  快速定义你的设计系统，并应用在设计稿和代码中"
      :search-words="[
        {
          text: 'Semi',
          style: {
            backgroundColor: 'rgba(var(--semi-teal-5), 1)',
            color: 'rgba(var(--semi-white), 1)',
            padding: '4px',
          },
          className: 'keyword1',
        },
        {
          text: '设计系统',
          style: {
            backgroundColor: 'var(--semi-color-primary)',
            color: 'rgba(var(--semi-white), 1)',
            padding: '4px',
          },
          className: 'keyword2',
        },
        {
          text: '设计稿和代码',
          style: {
            backgroundColor: 'rgba(var(--semi-violet-5), 1)',
            color: 'rgba(var(--semi-white), 1)',
            padding: '4px',
          },
          className: 'keyword3',
        },
      ]"
      :highlight-style="{ borderRadius: '4px' }"
    />
  </h2>
</template>
