<script setup lang="ts">
import { Popover } from '@aifuxi/semi-ui-vue/popover';
import '@aifuxi/semi-theme-default/popover.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
import { Empty } from '@aifuxi/semi-ui-vue/empty';
import '@aifuxi/semi-theme-default/empty.css';
import { IllustrationSuccess, IllustrationSuccessDark } from '@aifuxi/semi-illustrations-vue';
</script>
<template>
  <Popover>
    <Tag> 悬停此处</Tag>
    <template #content
      ><Empty
        :title="'先进的设计 / 研发协作方式'"
        description="使用 Semi D2C 快速还原 Figma 设计稿，一键转代码"
        :style="{
          width: '400px',
          margin: '0 auto',
          display: 'flex',
          padding: '20px',
        }"
      >
        <template #image
          ><IllustrationSuccess :style="{ width: '150px', height: '150px' }" /></template
        ><template #darkModeImage
          ><IllustrationSuccessDark
            :style="{
              width: '150px',
              height: '150px',
            }" /></template></Empty></template
  ></Popover>
</template>
