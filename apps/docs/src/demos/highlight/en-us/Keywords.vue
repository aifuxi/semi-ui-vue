<script setup lang="ts">
import { Highlight } from '@aifuxi/semi-ui-vue/highlight';
import '@aifuxi/semi-theme-default/highlight.css';
</script>
<template>
  <h2>
    <Highlight
      component="span"
      source-string="From Semi Design，To Any Design. Quickly define your design system and apply it to design drafts and code"
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
          text: 'Quickly',
          style: {
            backgroundColor: 'var(--semi-color-primary)',
            color: 'rgba(var(--semi-white), 1)',
            padding: '4px',
          },
          className: 'keyword2',
        },
        {
          text: 'code',
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
