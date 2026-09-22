<script setup lang="ts">
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/button.css';
import { IconLink } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/typography.css';
</script>

<template>
  <div>
    <Text :link="{ href: '/zh-cn/start/introduction/' }">链接文本</Text><br /><br /><Text
      :link="{ href: '/zh-cn/start/introduction/' }"
      >打开网站</Text
    ><br /><br /><Text link underline
      ><template #icon><IconLink /></template>带下划线的网页链接</Text
    >
  </div>
</template>
