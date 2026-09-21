<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
</script>
<template>
  <div>
    <Select default-value="douyin" :style="{ width: '120px' }">
      <SelectOption value="douyin">抖音</SelectOption>
      <SelectOption value="ulikecam">轻颜相机</SelectOption>
      <SelectOption value="jianying" disabled> 剪映 </SelectOption>
      <SelectOption value="xigua">西瓜视频</SelectOption>
    </Select>
    <br />
    <br />
    <Select default-value="douyin" disabled :style="{ width: '120px' }">
      <SelectOption value="douyin">抖音</SelectOption>
      <SelectOption value="ulikecam">轻颜相机</SelectOption>
    </Select>
    <br />
    <br />
    <Select placeholder="请选择业务线" :style="{ width: '120px' }">
      <SelectOption value="douyin">抖音</SelectOption>
      <SelectOption value="ulikecam">轻颜相机</SelectOption>
      <SelectOption value="jianying" disabled> 剪映 </SelectOption>
      <SelectOption value="xigua">西瓜视频</SelectOption>
    </Select>
  </div>
</template>
