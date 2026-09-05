<script setup lang="ts">
import { Empty } from '@aifuxi/semi-ui-vue/empty';
import '@aifuxi/semi-theme-default/empty.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import IllustrationSuccess from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationSuccess';
import IllustrationSuccessDark from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationSuccessDark';
</script>

<template>
  <Empty
    title="创建成功"
    layout="horizontal"
    description="这是一段很长的描述文本，当文本过长的时候推荐使用这种布局形式。这是一段很长的描述文本，当文本过长的时候推荐使用这种布局形式。这是一段很长的描述文本，当文本过长的时候推荐使用这种布局形式。"
    style="width: 800px; margin: 0 auto"
  >
    <template #image><IllustrationSuccess style="width: 150px; height: 150px" /></template>
    <template #darkModeImage
      ><IllustrationSuccessDark style="width: 150px; height: 150px"
    /></template>
    <Button type="primary" theme="solid" style="padding: 6px 24px">开始操作</Button>
  </Empty>
</template>
