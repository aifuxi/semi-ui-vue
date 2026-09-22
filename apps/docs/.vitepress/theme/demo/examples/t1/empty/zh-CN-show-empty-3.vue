<script setup lang="ts">
import { Empty } from '@aifuxi/semi-ui-vue/empty';
import '@aifuxi/semi-theme-default/empty.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { IllustrationNoContent, IllustrationNoContentDark } from '@aifuxi/semi-illustrations-vue';
</script>

<template>
  <Empty title="空状态标题" description="开始创建你的第一个仪表盘吧！">
    <template #image><IllustrationNoContent style="width: 150px; height: 150px" /></template>
    <template #darkModeImage
      ><IllustrationNoContentDark style="width: 150px; height: 150px"
    /></template>
    <div>
      <Button style="padding: 6px 24px; margin-right: 12px" type="primary">二级按钮</Button>
      <Button style="padding: 6px 24px" theme="solid" type="primary">一级按钮</Button>
    </div>
  </Empty>
</template>
