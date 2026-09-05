<script setup lang="ts">
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
</script>

<template>
  <Space vertical>
    <Space align="start">
      <div class="alignment-box">文本</div>
      <Button theme="solid" type="primary">按钮</Button>
      <Tag color="green" size="large">标签</Tag>
    </Space>
    <Space align="center">
      <div class="alignment-box">文本</div>
      <Button theme="solid" type="primary">按钮</Button>
      <Tag color="green" size="large">标签</Tag>
    </Space>
    <Space align="end">
      <div class="alignment-box">文本</div>
      <Button theme="solid" type="primary">按钮</Button>
      <Tag color="green" size="large">标签</Tag>
    </Space>
    <Space align="baseline">
      <div class="alignment-box">文本</div>
      <Button theme="solid" type="primary">按钮</Button>
      <Tag color="green" size="large">标签</Tag>
    </Space>
  </Space>
</template>

<style scoped>
.alignment-box {
  width: 80px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--semi-color-border);
  border-radius: 3px;
}
</style>
