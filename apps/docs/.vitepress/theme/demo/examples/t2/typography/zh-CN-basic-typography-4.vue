<script setup lang="ts">
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import { IconLink } from '@aifuxi/semi-icons-vue';
</script>

<template>
  <div>
    <Text :link="{ href: 'https://semi.design/' }">链接文本</Text>
    <br />
    <br />
    <Text :link="{ href: 'https://semi.design/' }">打开网站</Text>
    <br />
    <br />
    <Text link underline
      ><template #icon><IconLink /></template>带下划线的网页链接</Text
    >
  </div>
</template>
