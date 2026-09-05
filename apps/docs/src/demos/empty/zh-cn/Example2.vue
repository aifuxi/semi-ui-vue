<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Empty } from '@aifuxi/semi-ui-vue/empty';
import { IllustrationNoContent, IllustrationNoContentDark } from '@aifuxi/semi-illustrations-vue';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/empty.css';
</script>

<template>
  <Empty title="暂无仪表盘" description="创建第一个仪表盘开始分析数据。">
    <template #image>
      <IllustrationNoContent :style="{ width: '150px', height: '150px' }" />
    </template>
    <template #darkModeImage>
      <IllustrationNoContentDark :style="{ width: '150px', height: '150px' }" />
    </template>
    <Button type="primary" theme="solid">创建仪表盘</Button>
  </Empty>
</template>
