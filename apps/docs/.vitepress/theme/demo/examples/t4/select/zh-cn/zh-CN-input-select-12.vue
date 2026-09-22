<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
import { shallowRef } from 'vue';
import type { SelectModelValue } from '@aifuxi/semi-ui-vue/select';
const value = shallowRef<SelectModelValue>('xigua');
</script>
<template>
  <div>
    <Select v-model="value" :style="{ width: '300px' }" placeholder="受控的Select">
      <SelectOption value="douyin">抖音</SelectOption>
      <SelectOption value="ulikecam">轻颜相机</SelectOption>
      <SelectOption value="jianying">剪映</SelectOption>
      <SelectOption value="xigua">西瓜视频</SelectOption>
    </Select>
  </div>
</template>
