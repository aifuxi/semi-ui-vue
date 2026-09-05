<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
</script>
<template>
  <div>
    <Select
      placeholder="自定义弹出层样式的"
      :style="{ width: '180px' }"
      :dropdown-style="{ width: '250px' }"
      dropdown-class-name="test"
    >
      <SelectOption value="douyin">抖音</SelectOption>
      <SelectOption value="ulikecam">轻颜相机</SelectOption>
      <SelectOption value="jianying">剪映</SelectOption>
      <SelectOption value="xigua">西瓜视频</SelectOption>
    </Select>
  </div>
</template>
