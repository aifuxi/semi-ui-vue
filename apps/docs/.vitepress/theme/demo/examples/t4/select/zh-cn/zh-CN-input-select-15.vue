<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
</script>
<template>
  <div>
    <Select filter :style="{ width: '180px' }" placeholder="带搜索功能的单选">
      <SelectOption value="douyin">抖音</SelectOption>
      <SelectOption value="ulikecam">轻颜相机</SelectOption>
      <SelectOption value="jianying">剪映</SelectOption>
      <SelectOption value="xigua">西瓜视频</SelectOption>
    </Select>
    <br />
    <br />
    <Select
      filter
      multiple
      :style="{ width: '300px' }"
      placeholder="带搜索功能的多选"
      :auto-clear-search-value="false"
    >
      <SelectOption value="semi-0">Semi-0</SelectOption>
      <SelectOption value="semi-1">Semi-1</SelectOption>
      <SelectOption value="semi-2">Semi-2</SelectOption>
      <SelectOption value="semi-3">Semi-3</SelectOption>
      <SelectOption value="semi-4">Semi-4</SelectOption>
    </Select>
  </div>
</template>
